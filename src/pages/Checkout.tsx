import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ArtPrintLogo from '../assets/PaaJuuPrints.svg';
import { Button } from '../components/ui/button';
import Footer from '../components/navigation/Footer';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems } = useCart();
    const [addressVisibility, setAddressVisibility] = useState<{ [key: number]: boolean }>({});
    const [addresses, setAddresses] = useState<{ [key: number]: string }>({});

    const toggleAddress = (itemId: number) => {
        setAddressVisibility(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const handleAddressChange = (itemId: number, address: string) => {
        setAddresses(prev => ({
            ...prev,
            [itemId]: address
        }));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleMpesaPayment = () => {
        alert('Processing Mpesa payment...');
        // TODO: Implement Mpesa payment integration
    };

    const handleVisaPayment = () => {
        alert('Processing Visa payment...');
        // TODO: Implement Visa payment integration
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

                    {/* Cart Items */}
                    {cartItems.map((item) => (
                        <div key={item.id} style={{
                            display: 'flex',
                            gap: '20px',
                            padding: '1.5rem 0',
                            borderBottom: '1px solid #e0e0e0',
                            position: 'relative',
                        }}>
                            <div style={{
                                width: '120px',
                                height: '90px',
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
                                fontSize: '0.8rem',
                            }}>
                                {!item.image && 'Artwork'}
                            </div>

                            <div style={{ flexGrow: 1 }}>
                                <div style={{
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem',
                                    marginBottom: '5px',
                                }}>
                                    {item.title}
                                </div>
                                <div style={{
                                    color: '#666',
                                    fontSize: '0.9rem',
                                    marginBottom: '5px',
                                }}>
                                    {item.material} • {item.size}
                                </div>
                                <div style={{
                                    color: '#666',
                                    fontSize: '0.9rem',
                                    marginBottom: '5px',
                                }}>
                                    Quantity: {item.quantity}
                                </div>

                                {/* Delivery Address Toggle */}
                                <div
                                    onClick={() => toggleAddress(item.id)}
                                    style={{
                                        marginTop: '10px',
                                        display: 'inline-block',
                                        fontSize: '0.85rem',
                                        color: '#1a1a1a',
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Change delivery address
                                </div>
                                {addressVisibility[item.id] && (
                                    <div style={{
                                        background: '#fafafa',
                                        padding: '10px',
                                        border: '1px dashed #ccc',
                                        marginTop: '10px',
                                        fontSize: '0.9rem',
                                        borderRadius: '4px',
                                    }}>
                                        <strong>Current:</strong> 123 Ngong Rd, Nairobi<br />
                                        <input
                                            type="text"
                                            placeholder="Enter new address"
                                            value={addresses[item.id] || ''}
                                            onChange={(e) => handleAddressChange(item.id, e.target.value)}
                                            style={{
                                                marginTop: '5px',
                                                padding: '5px',
                                                width: '100%',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div style={{
                                fontWeight: 'bold',
                                fontSize: '1.2rem',
                                color: '#1a1a1a',
                                textAlign: 'right',
                                minWidth: '100px',
                            }}>
                                KES {(item.price * item.quantity).toLocaleString()}
                            </div>
                        </div>
                    ))}

                    {/* Total Section */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        padding: '2rem 0',
                        gap: '20px',
                    }}>
                        <span style={{
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                        }}>
                            Total
                        </span>
                        <span style={{
                            fontSize: '1.8rem',
                            fontWeight: 'bold',
                            color: '#1a1a1a',
                            border: '2px solid #1a1a1a',
                            padding: '5px 15px',
                            borderRadius: '4px',
                        }}>
                            KES {calculateTotal().toLocaleString()}
                        </span>
                    </div>

                    {/* Payment Buttons */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '15px',
                        marginTop: '1rem',
                    }}>
                        <button
                            onClick={handleMpesaPayment}
                            style={{
                                padding: '12px 30px',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'opacity 0.2s',
                                backgroundColor: '#4caf50',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            <span style={{
                                width: '20px',
                                height: '20px',
                                background: 'rgba(255,255,255,0.2)',
                                borderRadius: '50%',
                            }}></span>
                            Mpesa
                        </button>
                        <button
                            onClick={handleVisaPayment}
                            style={{
                                padding: '12px 30px',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'opacity 0.2s',
                                backgroundColor: '#1a1f71',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            <span style={{
                                width: '20px',
                                height: '20px',
                                background: 'rgba(255,255,255,0.2)',
                                borderRadius: '50%',
                            }}></span>
                            Visa
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Checkout;
