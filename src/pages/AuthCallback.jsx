import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * AuthCallback handles the redirect from Supabase Google OAuth.
 * Supabase uses the implicit flow and delivers the token in the URL hash: 
 *   /auth/callback#access_token=...&refresh_token=...
 */
const AuthCallback = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        // Parse the hash fragment (#access_token=...&refresh_token=...&...)
        const hash = window.location.hash.substring(1); // Remove the leading #
        const params = new URLSearchParams(hash);

        const accessToken = params.get('access_token');
        const errorCode = params.get('error');
        const errorDescription = params.get('error_description');

        if (errorCode) {
            console.error('[AuthCallback] OAuth error:', errorCode, errorDescription);
            setError(errorDescription || 'Google login failed. Please try again.');
            return;
        }

        if (!accessToken) {
            // Also check query params (fallback)
            const queryParams = new URLSearchParams(window.location.search);
            const queryError = queryParams.get('error');
            if (queryError) {
                setError('Google login failed: ' + queryError);
            } else {
                setError('No authentication token received. Please try again.');
            }
            return;
        }

        try {
            // Decode the JWT to extract user metadata  
            // (no Supabase client needed — the payload is just base64)
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
            console.error('[AuthCallback] Failed to parse token:', e);
            setError('Failed to process login. Please try again.');
        }
    }, [navigate]);

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
