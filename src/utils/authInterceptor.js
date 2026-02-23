/**
 * Global Fetch Interceptor
 * 
 * Overrides the browser's window.fetch to automatically detect 401 Unauthorized errors.
 * If a 401 is detected, it clears local session storage and redirects to the login page.
 */

const originalFetch = window.fetch;

window.fetch = async (...args) => {
    try {
        const response = await originalFetch(...args);

        if (response.status === 401) {
            console.warn('[Auth Interceptor] 401 Unauthorized detected. Clearing session...');

            // Clear local credentials
            localStorage.removeItem('authToken');
            localStorage.removeItem('userCredentials');

            // Redirect to login if not already there
            if (!window.location.pathname.startsWith('/login')) {
                window.location.href = '/login?expired=true';
            }
        }

        return response;
    } catch (error) {
        // Handle network errors if necessary
        return Promise.reject(error);
    }
};

console.log('[Auth Interceptor] Global fetch monitoring enabled.');
