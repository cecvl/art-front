import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyPayment } from '../services/payment';
import type { Payment } from '../types/payment';
import { Button } from '../components/ui/button';
import ArtPrintLogo from '../assets/PaaJuuPrints.svg';
import Footer from '../components/navigation/Footer';

const PaymentStatus = () => {
    const { paymentId } = useParams<{ paymentId: string }>();
    const navigate = useNavigate();
    const [payment, setPayment] = useState<Payment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!paymentId) {
            setError('No payment ID provided');
            setLoading(false);
            return;
        }

        const checkPaymentStatus = async () => {
            try {
                const paymentData = await verifyPayment(paymentId);
                setPayment(paymentData);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to verify payment');
            } finally {
                setLoading(false);
            }
        };

        checkPaymentStatus();

        // Auto-refresh for pending/processing payments
        const interval = setInterval(() => {
            if (payment?.status === 'pending' || payment?.status === 'processing') {
                checkPaymentStatus();
            }
        }, 5000); // Check every 5 seconds

        return () => clearInterval(interval);
    }, [paymentId, payment?.status]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return '#4caf50';
            case 'failed':
                return '#f44336';
            case 'refunded':
                return '#ff9800';
            case 'pending':
            case 'processing':
                return '#2196f3';
            default:
                return '#666';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return '✓';
            case 'failed':
                return '✗';
            case 'pending':
            case 'processing':
                return '⟳';
            case 'refunded':
                return '↩';
            default:
                return '?';
        }
    };

    return (
        <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center border-b border-gray-200 bg-gray-50 px-3 py-3 sm:px-4">
                <div className="flex flex-none items-center min-w-[62px]">
                    <img
                        src={ArtPrintLogo}
                        alt="ArtPrint Logo"
                        className="ml-1 mr-6 h-11 w-auto cursor-pointer transition-opacity hover:opacity-80"
                        onClick={() => navigate('/')}
                    />
                </div>
            </header>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '2rem' }}>
                <div style={{
                    maxWidth: '600px',
                    margin: '0 auto',
                    background: '#ffffff',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    padding: '2rem',
                }}>
                    <h2 style={{
                        marginTop: 0,
                        borderBottom: '1px solid #e0e0e0',
                        paddingBottom: '1rem',
                        color: '#1a1a1a',
                    }}>
                        Payment Status
                    </h2>

                    {loading && (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                border: '4px solid #f3f3f3',
                                borderTop: '4px solid #2196f3',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                margin: '0 auto 1rem',
                            }} />
                            <p style={{ color: '#666' }}>Verifying payment...</p>
                        </div>
                    )}

                    {error && (
                        <div style={{
                            background: '#ffebee',
                            border: '1px solid #f44336',
                            borderRadius: '4px',
                            padding: '1rem',
                            marginTop: '1rem',
                            color: '#c62828',
                        }}>
                            <strong>Error:</strong> {error}
                        </div>
                    )}

                    {payment && !loading && (
                        <div style={{ marginTop: '1.5rem' }}>
                            {/* Status Badge */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '1rem',
                                padding: '2rem',
                                background: `${getStatusColor(payment.status)}15`,
                                borderRadius: '8px',
                                marginBottom: '2rem',
                            }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    background: getStatusColor(payment.status),
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                }}>
                                    {getStatusIcon(payment.status)}
                                </div>
                                <div>
                                    <div style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        color: getStatusColor(payment.status),
                                        textTransform: 'capitalize',
                                    }}>
                                        {payment.status}
                                    </div>
                                    {(payment.status === 'pending' || payment.status === 'processing') && (
                                        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                                            Please wait while we process your payment...
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Payment Details */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#1a1a1a' }}>Payment Details</h3>
                                <div style={{ display: 'grid', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#666' }}>Payment ID:</span>
                                        <span style={{ fontWeight: 'bold' }}>{payment.id}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#666' }}>Amount:</span>
                                        <span style={{ fontWeight: 'bold' }}>KES {payment.amount.toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#666' }}>Payment Type:</span>
                                        <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{payment.paymentType}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#666' }}>Method:</span>
                                        <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{payment.paymentMethod}</span>
                                    </div>
                                    {payment.transactionId && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: '#666' }}>Transaction ID:</span>
                                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{payment.transactionId}</span>
                                        </div>
                                    )}
                                    {payment.failureReason && (
                                        <div style={{
                                            background: '#ffebee',
                                            padding: '0.75rem',
                                            borderRadius: '4px',
                                            marginTop: '0.5rem',
                                        }}>
                                            <strong style={{ color: '#c62828' }}>Failure Reason:</strong>
                                            <div style={{ color: '#666', marginTop: '0.25rem' }}>{payment.failureReason}</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                {payment.status === 'completed' && (
                                    <>
                                        <Button
                                            onClick={() => navigate('/orders')}
                                            style={{ flex: 1 }}
                                        >
                                            View Orders
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => navigate('/')}
                                            style={{ flex: 1 }}
                                        >
                                            Continue Shopping
                                        </Button>
                                    </>
                                )}
                                {payment.status === 'failed' && (
                                    <>
                                        <Button
                                            onClick={() => navigate('/checkout')}
                                            style={{ flex: 1 }}
                                        >
                                            Try Again
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => navigate('/')}
                                            style={{ flex: 1 }}
                                        >
                                            Back to Home
                                        </Button>
                                    </>
                                )}
                                {(payment.status === 'pending' || payment.status === 'processing') && (
                                    <Button
                                        variant="outline"
                                        onClick={() => window.location.reload()}
                                        style={{ width: '100%' }}
                                    >
                                        Refresh Status
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />

            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default PaymentStatus;
