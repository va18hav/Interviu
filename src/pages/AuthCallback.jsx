import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * AuthCallback handles two flows:
 *
 * 1. Backend Google OAuth (PKCE/code exchange):
 *    - Backend redirects here with ?code=<one-time-opaque-code>
 *    - We POST that code to /api/auth/exchange to receive the real session
 *
 * 2. Supabase implicit flow (hash fragment):
 *    - Supabase delivers #access_token=... directly in the URL hash
 */
const AuthCallback = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const oauthCode = queryParams.get('code');
        const queryError = queryParams.get('error');

        // --- Flow 1: Backend one-time code exchange ---
        if (oauthCode) {
            exchangeCode(oauthCode);
            return;
        }

        // --- Error in query string (e.g. oauth_failed) ---
        if (queryError) {
            setError('Google login failed: ' + queryError);
            return;
        }

        // --- Flow 2: Supabase implicit flow via hash fragment ---
        const hash = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hash);
        const accessToken = hashParams.get('access_token');
        const hashError = hashParams.get('error');

        if (hashError) {
            setError(hashParams.get('error_description') || 'Google login failed. Please try again.');
            return;
        }

        if (accessToken) {
            processImplicitToken(accessToken);
            return;
        }

        setError('No authentication token received. Please try again.');
    }, [navigate]);

    async function exchangeCode(code) {
        try {
            const response = await fetch(`${API_URL}/api/auth/exchange`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.error || 'Exchange failed');
            }

            const { token, user } = await response.json();

            // Store credentials — token was delivered over HTTPS body, never in any URL
            localStorage.setItem('authToken', token);
            localStorage.setItem('userCredentials', JSON.stringify(user));

            // Clear the code from the URL bar immediately for hygiene
            window.history.replaceState({}, '', '/dashboard');
            navigate('/dashboard', { replace: true });
        } catch (e) {
            console.error('[AuthCallback] Code exchange failed:', e);
            setError('Failed to complete login. Please try again.');
        }
    }

    function processImplicitToken(accessToken) {
        try {
            const payloadBase64 = accessToken.split('.')[1];
            const payload = JSON.parse(atob(payloadBase64));

            const userMeta = payload?.user_metadata || {};
            const fullName = userMeta.full_name || userMeta.name || 'User';
            const nameParts = fullName.trim().split(' ');

            const safeUser = {
                id: payload.sub,
                firstName: nameParts[0] || 'User',
                lastName: nameParts.slice(1).join(' ') || '',
                email: payload.email || userMeta.email || '',
                avatarUrl: userMeta.avatar_url || userMeta.picture || null
            };

            localStorage.setItem('userCredentials', JSON.stringify(safeUser));
            localStorage.setItem('authToken', accessToken);

            navigate('/dashboard', { replace: true });
        } catch (e) {
            console.error('[AuthCallback] Failed to parse implicit token:', e);
            setError('Failed to process login. Please try again.');
        }
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center space-y-4 max-w-sm px-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-red-600 text-xl">✕</span>
                    </div>
                    <p className="text-red-600 font-medium">{error}</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="text-cyan-600 hover:underline font-medium text-sm"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center space-y-3">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-slate-600 font-medium">Signing you in with Google...</p>
            </div>
        </div>
    );
};

export default AuthCallback;
