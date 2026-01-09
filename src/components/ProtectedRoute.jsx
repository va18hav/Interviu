import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Check if user credentials exist in local storage
    // You might want to enhance this with actual token validation later
    const userCredentials = JSON.parse(localStorage.getItem("userCredentials"));

    if (!userCredentials) {
        // If not authenticated, redirect to login page
        return <Navigate to="/login" replace />;
    }

    // If authenticated, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;
