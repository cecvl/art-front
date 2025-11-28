import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * Protected Route Component
 * Redirects unauthenticated users to homepage with return URL
 * Allows authenticated users to access the wrapped component
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Wait for auth check to complete
        if (!loading && !isAuthenticated) {
            // Save the current path as return URL
            const returnUrl = location.pathname + location.search;

            // Show toast notification
            toast.info('Please log in to access this page', {
                duration: 3000,
            });

            // Redirect to homepage with return URL in state
            navigate('/', {
                replace: true,
                state: { returnUrl }
            });
        }
    }, [isAuthenticated, loading, navigate, location]);

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // If authenticated, render the protected content
    if (isAuthenticated) {
        return <>{children}</>;
    }

    // If not authenticated, return null (will redirect via useEffect)
    return null;
};

export default ProtectedRoute;
