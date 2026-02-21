import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Check for user credentials and auth token
    const userCredentials = JSON.parse(localStorage.getItem("userCredentials"));
    const authToken = localStorage.getItem("authToken");

    if (!userCredentials || !authToken) {
        // If not authenticated, redirect to login page
        return <Navigate to="/login" replace />;
    }

    // If authenticated, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;
