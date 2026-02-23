import { supabase } from '../utils/supabase.js';

/**
 * requireAuth(options?)
 *
 * Express middleware that:
 *  1. Extracts JWT from `Authorization: Bearer <token>` header.
 *  2. Verifies it with Supabase and retrieves the user object.
 *  3. Optionally asserts that the verified user.id matches a `userId` supplied
 *     in the request body or query string (prevents acting as another user).
 *  4. Attaches `req.user` and `req.userId` for downstream handlers.
 *
 * @param {object}  opts
 * @param {boolean} opts.checkUserId  - When true (default), asserts that the JWT
 *                                      owner matches the userId in body/query.
 *                                      Set false for endpoints that don't receive
 *                                      an explicit userId (e.g. /api/auth/user).
 */
export function requireAuth({ checkUserId = true } = {}) {
    return async (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: missing token' });
        }

        const token = authHeader.split(' ')[1];
        if (!token || token === 'null' || token === 'undefined') {
            return res.status(401).json({ error: 'Unauthorized: missing token' });
        }

        try {
            // C-1: Retry logic for transient network timeouts (Supabase)
            let user, error;
            for (let attempt = 1; attempt <= 2; attempt++) {
                const response = await supabase.auth.getUser(token);
                user = response.data?.user;
                error = response.error;

                if (!error && user) break;

                if (error && (error.code === 'UND_ERR_CONNECT_TIMEOUT' || error.message?.includes('fetch failed')) && attempt < 2) {
                    console.warn(`[requireAuth] Supabase connection timeout (attempt ${attempt}). Retrying...`);
                    await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1s before retry
                    continue;
                }
                break;
            }

            if (error || !user) {
                if (error) console.error('[requireAuth] Token verification failed:', error.message, error.status);
                return res.status(401).json({ error: 'Unauthorized: invalid token' });
            }

            req.user = user;
            req.userId = user.id;

            if (checkUserId) {
                // Resolve the claimed userId from body or query string
                const claimedUserId = req.body?.userId ?? req.query?.userId;
                if (claimedUserId && claimedUserId !== user.id) {
                    return res.status(403).json({ error: 'Forbidden: userId mismatch' });
                }
            }

            next();
        } catch (err) {
            console.error('[requireAuth] Token verification error:', err);
            return res.status(500).json({ error: 'Internal server error during authentication' });
        }
    };
}
