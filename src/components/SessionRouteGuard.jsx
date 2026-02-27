import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';

/**
 * SessionRouteGuard prevents direct access to routes that require 
 * specific background data (location.state) to function correctly.
 * 
 * If the user navigates to these routes without the required state,
 * they are redirected to the dashboard.
 */
const SessionRouteGuard = ({ requiredFields = [] }) => {
    const location = useLocation();

    // Check if location state exists
    const hasState = location.state !== null && typeof location.state === 'object';

    // Check if all required fields are present in state
    const hasRequiredFields = requiredFields.every(field =>
        hasState && Object.prototype.hasOwnProperty.call(location.state, field)
    );

    if (!hasState || !hasRequiredFields) {
        console.warn(`[SessionGuard] Redirecting to dashboard: Missing session state for ${location.pathname}`);
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default SessionRouteGuard;
