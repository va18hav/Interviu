import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Check for user credentials and auth token
    const userCredentials = JSON.parse(localStorage.getItem("userCredentials"));
    const authToken = localStorage.getItem("authToken");

    // Basic validity check: must exist and have at least 3 parts (header.payload.signature)
    const isTokenLikelyValid = authToken && authToken.split('.').length === 3;

    if (!userCredentials || !isTokenLikelyValid) {
        // If not authenticated or token looks broken, clear and redirect
        // This prevents the "Dashboard loads but no data" bug for obviously bad tokens
        localStorage.removeItem('authToken');
        localStorage.removeItem('userCredentials');
        return <Navigate to="/login" replace />;
    }

    // If authenticated, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;
