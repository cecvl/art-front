import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { checkout } from '../services/orders';
import { createPayment } from '../services/payment';
import { syncCartToBackend } from '../services/cart';
import type { PaymentType } from '../types/payment';
import ArtPrintLogo from '../assets/PaaJuuPrints.svg';
import { Button } from '../components/ui/button';
import Footer from '../components/navigation/Footer';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, clearCart } = useCart();
    const [paymentType, setPaymentType] = useState<PaymentType>('full');
    const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'visa' | 'simulated'>('mpesa');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const calculatePaymentAmount = () => {
        const total = calculateTotal();
        return paymentType === 'deposit' ? total * 0.5 : total;
    };

    const handleCheckout = async () => {
        setProcessing(true);
        setError(null);

        try {
            // Step 0: Sync frontend cart to backend
            // Backend /checkout reads from backend cart, not request body
            console.log('🛒 Syncing cart to backend...', cartItems);
            await syncCartToBackend(cartItems);

            // Step 1: Create order from cart
            // Backend returns the order directly, not wrapped in {order: ...}
            console.log('📦 Creating order...');
            const order = await checkout({
                deliveryMethod: 'shipping', // Default to shipping
            });
            console.log('✅ Order created:', order);
            console.log('📝 Order ID:', order.orderId);

            // Step 2: Create payment
            console.log('💳 Creating payment for order:', order.orderId);
            const paymentResponse = await createPayment({
                orderId: order.orderId,
                paymentMethod,
                paymentType,
            });
            console.log('✅ Payment created:', paymentResponse);

            // Step 3: Clear cart on successful order creation
            clearCart();

            // Step 4: Handle payment redirect or navigate to status page
            if (paymentResponse.paymentUrl) {
                // If provider needs redirect (e.g., Stripe), redirect to payment URL
                window.location.href = paymentResponse.paymentUrl;
            } else {
                // Navigate to payment status page
                navigate(`/payment-status/${paymentResponse.paymentId}`);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to process checkout');
            setProcessing(false);
        }
    };

    if (cartItems.length === 0) {
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

                {/* Back Button */}
                <div style={{
                    position: 'fixed',
                    top: '80px',
                    right: '20px',
                    zIndex: 50,
                }}>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(-1)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back
                    </Button>
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{
                        maxWidth: '800px',
                        margin: '2rem auto',
                        background: '#ffffff',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                        padding: '2rem',
                        textAlign: 'center',
                    }}>
                        <h2 style={{ marginTop: 0, color: '#1a1a1a' }}>Your cart is empty</h2>
                        <p style={{ color: '#666', marginBottom: '2rem' }}>Add some items to your cart before checking out.</p>
                        <Button onClick={() => navigate('/')}>
                            Start Shopping
                        </Button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

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

            {/* Back Button */}
            <div style={{
                position: 'fixed',
                top: '80px',
                right: '20px',
                zIndex: 50,
            }}>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(-1)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back
                </Button>
            </div>

            {/* Main Container */}
            <div style={{ flex: 1, paddingBottom: '50px' }}>
                <div style={{
                    maxWidth: '800px',
                    margin: '2rem auto',
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
                        Checkout
                    </h2>

                    {/* Error Message */}
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

                    {/* Cart Items */}
                    <div style={{ marginTop: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#1a1a1a' }}>Order Summary</h3>
                        {cartItems.map((item) => (
                            <div key={item.id} style={{
                                display: 'flex',
                                gap: '20px',
                                padding: '1rem 0',
                                borderBottom: '1px solid #e0e0e0',
                            }}>
                                <div style={{
                                    width: '80px',
                                    height: '60px',
                                    backgroundColor: '#eee',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    flexShrink: 0,
                                    backgroundImage: item.image ? `url(${item.image})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#999',
                                    fontSize: '0.7rem',
                                }}>
                                    {!item.image && 'Art'}
                                </div>

                                <div style={{ flexGrow: 1 }}>
                                    <div style={{
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                        marginBottom: '3px',
                                    }}>
                                        {item.title}
                                    </div>
                                    <div style={{
                                        color: '#666',
                                        fontSize: '0.85rem',
                                    }}>
                                        {item.material} • {item.size} • Qty: {item.quantity}
                                    </div>
                                </div>

                                <div style={{
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    color: '#1a1a1a',
                                    textAlign: 'right',
                                }}>
                                    KES {(item.price * item.quantity).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Payment Type Selection */}
                    <div style={{ marginTop: '2rem' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#1a1a1a' }}>Payment Type</h3>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => setPaymentType('full')}
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    border: paymentType === 'full' ? '2px solid #1a1a1a' : '1px solid #ccc',
                                    borderRadius: '8px',
                                    background: paymentType === 'full' ? '#f5f5f5' : 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Full Payment</div>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>Pay 100% now</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#1a1a1a' }}>
                                    KES {calculateTotal().toLocaleString()}
                                </div>
                            </button>
                            <button
                                onClick={() => setPaymentType('deposit')}
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    border: paymentType === 'deposit' ? '2px solid #1a1a1a' : '1px solid #ccc',
                                    borderRadius: '8px',
                                    background: paymentType === 'deposit' ? '#f5f5f5' : 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>50% Deposit</div>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>Pay remaining 50% later</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#1a1a1a' }}>
                                    KES {(calculateTotal() * 0.5).toLocaleString()}
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div style={{ marginTop: '2rem' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#1a1a1a' }}>Payment Method</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                            <button
                                onClick={() => setPaymentMethod('mpesa')}
                                style={{
                                    padding: '1rem',
                                    border: paymentMethod === 'mpesa' ? '2px solid #4caf50' : '1px solid #ccc',
                                    borderRadius: '8px',
                                    background: paymentMethod === 'mpesa' ? '#e8f5e9' : 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <div style={{ fontWeight: 'bold', color: '#4caf50' }}>M-Pesa</div>
                            </button>
                            <button
                                onClick={() => setPaymentMethod('visa')}
                                style={{
                                    padding: '1rem',
                                    border: paymentMethod === 'visa' ? '2px solid #1a1f71' : '1px solid #ccc',
                                    borderRadius: '8px',
                                    background: paymentMethod === 'visa' ? '#e3f2fd' : 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <div style={{ fontWeight: 'bold', color: '#1a1f71' }}>Visa/Card</div>
                            </button>
                            <button
                                onClick={() => setPaymentMethod('simulated')}
                                style={{
                                    padding: '1rem',
                                    border: paymentMethod === 'simulated' ? '2px solid #ff9800' : '1px solid #ccc',
                                    borderRadius: '8px',
                                    background: paymentMethod === 'simulated' ? '#fff3e0' : 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <div style={{ fontWeight: 'bold', color: '#ff9800' }}>Test Payment</div>
                            </button>
                        </div>
                    </div>

                    {/* Total and Checkout Button */}
                    <div style={{
                        marginTop: '2rem',
                        paddingTop: '1.5rem',
                        borderTop: '2px solid #e0e0e0',
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1.5rem',
                        }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                Amount to Pay Now
                            </span>
                            <span style={{
                                fontSize: '1.8rem',
                                fontWeight: 'bold',
                                color: '#1a1a1a',
                            }}>
                                KES {calculatePaymentAmount().toLocaleString()}
                            </span>
                        </div>

                        <Button
                            onClick={handleCheckout}
                            disabled={processing}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                opacity: processing ? 0.6 : 1,
                                cursor: processing ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {processing ? 'Processing...' : `Pay KES ${calculatePaymentAmount().toLocaleString()}`}
                        </Button>

                        {paymentType === 'deposit' && (
                            <div style={{
                                marginTop: '1rem',
                                padding: '0.75rem',
                                background: '#fff3e0',
                                borderRadius: '4px',
                                fontSize: '0.9rem',
                                color: '#666',
                            }}>
                                <strong>Note:</strong> You'll pay the remaining KES {(calculateTotal() * 0.5).toLocaleString()} before delivery.
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Checkout;
