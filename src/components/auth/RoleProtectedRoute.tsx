import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface RoleProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

const RoleProtectedRoute = ({ children, allowedRoles }: RoleProtectedRouteProps) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{
                padding: '3rem',
                textAlign: 'center',
                minHeight: '50vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        // Not authenticated - redirect to home with login trigger
        const returnUrl = encodeURIComponent(location.pathname);
        return <Navigate to={`/?showLogin=true&returnUrl=${returnUrl}`} replace />;
    }

    // If user exists but roles haven't loaded yet, show loading
    // This prevents showing "Access Denied" before roles are fetched
    if (user.roles === undefined) {
        return (
            <div style={{
                padding: '3rem',
                textAlign: 'center',
                minHeight: '50vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <p>Loading permissions...</p>
            </div>
        );
    }

    // Check if user has any of the allowed roles
    const hasRole = user.roles?.some(role => allowedRoles.includes(role));

    if (!hasRole) {
        // Authenticated but wrong role - show access denied
        return (
            <div style={{
                padding: '3rem',
                textAlign: 'center',
                maxWidth: '600px',
                margin: '0 auto',
                minHeight: '50vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div style={{
                    background: '#fff',
                    padding: '2rem',
                    borderRadius: '8px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                }}>
                    <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#d32f2f"
                        strokeWidth="2"
                        style={{ marginBottom: '1rem' }}
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>

                    <h2 style={{ marginTop: 0, marginBottom: '1rem', color: '#1a1a1a' }}>
                        Access Denied
                    </h2>

                    <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                        You don't have permission to access this page.
                    </p>

                    <div style={{
                        background: '#f5f5f5',
                        padding: '1rem',
                        borderRadius: '4px',
                        marginTop: '1.5rem',
                        fontSize: '0.9rem',
                    }}>
                        <p style={{ margin: '0 0 0.5rem 0', color: '#888' }}>
                            <strong>Required role:</strong> {allowedRoles.map(role =>
                                role === 'printShop' ? 'Print Shop' :
                                    role === 'artist' ? 'Artist' :
                                        role === 'buyer' ? 'Buyer' : role
                            ).join(' or ')}
                        </p>
                        <p style={{ margin: 0, color: '#888' }}>
                            <strong>Your current roles:</strong> {
                                user.roles && user.roles.length > 0
                                    ? user.roles.map(role =>
                                        role === 'printShop' ? 'Print Shop' :
                                            role === 'artist' ? 'Artist' :
                                                role === 'buyer' ? 'Buyer' : role
                                    ).join(', ')
                                    : 'None'
                            }
                        </p>
                    </div>

                    <button
                        onClick={() => window.location.href = '/'}
                        style={{
                            marginTop: '1.5rem',
                            padding: '0.75rem 1.5rem',
                            background: '#1a1a1a',
                            color: '#FFD700',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                        }}
                    >
                        Return to Homepage
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default RoleProtectedRoute;
