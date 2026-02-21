import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const userRaw = params.get('user');
        const oauthError = params.get('error');

        if (oauthError) {
            setError('Google login failed. Please try again.');
            return;
        }

        if (!token || !userRaw) {
            setError('Missing authentication data. Please try again.');
            return;
        }

        try {
            const user = JSON.parse(userRaw);
            localStorage.setItem('userCredentials', JSON.stringify(user));
            localStorage.setItem('authToken', token);
            navigate('/dashboard', { replace: true });
        } catch (e) {
            setError('Failed to parse user data. Please try again.');
        }
    }, [navigate]);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-red-600 font-medium">{error}</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="text-cyan-600 hover:underline font-medium"
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
                <p className="text-slate-600 font-medium">Signing you in...</p>
            </div>
        </div>
    );
};

export default AuthCallback;
