import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../features/auth/LoginModal';
import SignUpModal from '../features/auth/SignUpModal';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * Protected Route Component
 * Shows login modal for unauthenticated users
 * Allows authenticated users to access the wrapped component
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Wait for auth check to complete
        if (!loading) {
            if (!isAuthenticated) {
                // Show login modal for unauthenticated users
                setShowLoginModal(true);
            }
        }
    }, [isAuthenticated, loading]);

    // Handle login modal close - redirect to home if not authenticated
    const handleLoginClose = () => {
        setShowLoginModal(false);
        if (!isAuthenticated) {
            navigate('/');
        }
    };

    // Handle signup modal close
    const handleSignUpClose = () => {
        setShowSignUpModal(false);
        if (!isAuthenticated) {
            navigate('/');
        }
    };

    // Switch between login and signup modals
    const handleSwitchToSignUp = () => {
        setShowLoginModal(false);
        setShowSignUpModal(true);
    };

    const handleSwitchToLogin = () => {
        setShowSignUpModal(false);
        setShowLoginModal(true);
    };

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

    // If not authenticated, show login modal and a message
    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
                    <p className="text-gray-600">Please log in to access this page.</p>
                </div>
            </div>

            <LoginModal
                open={showLoginModal}
                onClose={handleLoginClose}
                onSignUpClick={handleSwitchToSignUp}
            />

            <SignUpModal
                open={showSignUpModal}
                onClose={handleSignUpClose}
                onLoginClick={handleSwitchToLogin}
            />
        </>
    );
};

export default ProtectedRoute;
