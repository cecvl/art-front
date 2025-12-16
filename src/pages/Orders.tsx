import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../services/orders';
import { getPayments } from '../services/payment';
import type { Order } from '../types/order';
import type { Payment } from '../types/payment';
import { Button } from '../components/ui/button';
import Footer from '../components/navigation/Footer';

const Orders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [orderPayments, setOrderPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getOrders();
            setOrders(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleViewOrder = async (order: Order) => {
        setSelectedOrder(order);
        try {
            const payments = await getPayments(order.OrderID);
            setOrderPayments(payments);
        } catch (err) {
            console.error('Failed to fetch payments:', err);
            setOrderPayments([]);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return '#4caf50';
            case 'confirmed':
            case 'processing':
                return '#2196f3';
            case 'ready':
                return '#ff9800';
            case 'pending':
                return '#9e9e9e';
            default:
                return '#666';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return '#4caf50';
            case 'partial':
                return '#ff9800';
            case 'unpaid':
                return '#f44336';
            default:
                return '#666';
        }
    };

    return (
        <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Simple Header */}
            <header style={{
                background: 'white',
                borderBottom: '1px solid #e0e0e0',
                padding: '1rem 2rem',
                position: 'sticky',
                top: 0,
                zIndex: 50,
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#1a1a1a', cursor: 'pointer' }} onClick={() => navigate('/')}>
                        PaaJuuPrints
                    </h1>
                    <Button variant="outline" onClick={() => navigate('/')}>
                        Home
                    </Button>
                </div>
            </header>

            <div style={{ flex: 1, padding: '2rem' }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '2rem',
                    }}>
                        <h1 style={{ margin: 0, color: '#1a1a1a' }}>My Orders</h1>
                        <Button onClick={() => navigate('/')}>
                            Continue Shopping
                        </Button>
                    </div>

                    {loading && (
                        <div style={{
                            background: 'white',
                            borderRadius: '8px',
                            padding: '3rem',
                            textAlign: 'center',
                        }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                border: '4px solid #f3f3f3',
                                borderTop: '4px solid #2196f3',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                margin: '0 auto 1rem',
                            }} />
                            <p style={{ color: '#666' }}>Loading orders...</p>
                        </div>
                    )}

                    {error && (
                        <div style={{
                            background: '#ffebee',
                            border: '1px solid #f44336',
                            borderRadius: '8px',
                            padding: '1rem',
                            color: '#c62828',
                        }}>
                            <strong>Error:</strong> {error}
                        </div>
                    )}

                    {!loading && !error && orders.length === 0 && (
                        <div style={{
                            background: 'white',
                            borderRadius: '8px',
                            padding: '3rem',
                            textAlign: 'center',
                        }}>
                            <h2 style={{ color: '#1a1a1a' }}>No orders yet</h2>
                            <p style={{ color: '#666', marginBottom: '2rem' }}>
                                Start shopping to create your first order!
                            </p>
                            <Button onClick={() => navigate('/')}>
                                Browse Artworks
                            </Button>
                        </div>
                    )}

                    {!loading && !error && orders.length > 0 && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: selectedOrder ? '1fr 1fr' : '1fr',
                            gap: '2rem',
                        }}>
                            {/* Orders List */}
                            <div>
                                {orders.map((order) => (
                                    <div
                                        key={order.OrderID}
                                        onClick={() => handleViewOrder(order)}
                                        style={{
                                            background: 'white',
                                            borderRadius: '8px',
                                            padding: '1.5rem',
                                            marginBottom: '1rem',
                                            cursor: 'pointer',
                                            border: selectedOrder?.OrderID === order.OrderID ? '2px solid #1a1a1a' : '1px solid #e0e0e0',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            marginBottom: '1rem',
                                        }}>
                                            <div>
                                                <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.25rem' }}>
                                                    Order #{order.OrderID.slice(0, 8)}
                                                </div>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                                                    KES {order.TotalAmount.toLocaleString()}
                                                </div>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.5rem',
                                                alignItems: 'flex-end',
                                            }}>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '12px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 'bold',
                                                    background: `${getStatusColor(order.Status)}20`,
                                                    color: getStatusColor(order.Status),
                                                    textTransform: 'capitalize',
                                                }}>
                                                    {order.Status}
                                                </span>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '12px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 'bold',
                                                    background: `${getPaymentStatusColor(order.PaymentStatus)}20`,
                                                    color: getPaymentStatusColor(order.PaymentStatus),
                                                    textTransform: 'capitalize',
                                                }}>
                                                    {order.PaymentStatus}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                            {order.Items.length} item(s) • {new Date(order.CreatedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Details */}
                            {selectedOrder && (
                                <div style={{
                                    background: 'white',
                                    borderRadius: '8px',
                                    padding: '1.5rem',
                                    position: 'sticky',
                                    top: '100px',
                                    maxHeight: 'calc(100vh - 120px)',
                                    overflowY: 'auto',
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '1.5rem',
                                        paddingBottom: '1rem',
                                        borderBottom: '1px solid #e0e0e0',
                                    }}>
                                        <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Order Details</h2>
                                        <button
                                            onClick={() => setSelectedOrder(null)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                fontSize: '1.5rem',
                                                cursor: 'pointer',
                                                color: '#666',
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                                            Order ID
                                        </div>
                                        <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                                            {selectedOrder.orderId}
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Items</h3>
                                        {selectedOrder.items.map((item, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    padding: '0.75rem 0',
                                                    borderBottom: index < selectedOrder.items.length - 1 ? '1px solid #e0e0e0' : 'none',
                                                }}
                                            >
                                                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                                                    Artwork ID: {item.artworkId}
                                                </div>
                                                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                                    Quantity: {item.quantity} • KES {item.price.toLocaleString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Payment History</h3>
                                        {orderPayments.length === 0 ? (
                                            <div style={{ color: '#666', fontSize: '0.9rem' }}>
                                                No payments found
                                            </div>
                                        ) : (
                                            orderPayments.map((payment) => (
                                                <div
                                                    key={payment.id}
                                                    style={{
                                                        padding: '0.75rem',
                                                        background: '#f5f5f5',
                                                        borderRadius: '4px',
                                                        marginBottom: '0.5rem',
                                                    }}
                                                >
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        marginBottom: '0.5rem',
                                                    }}>
                                                        <span style={{ fontWeight: 'bold' }}>
                                                            KES {payment.amount.toLocaleString()}
                                                        </span>
                                                        <span style={{
                                                            padding: '0.125rem 0.5rem',
                                                            borderRadius: '8px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 'bold',
                                                            background: payment.status === 'completed' ? '#e8f5e9' : '#fff3e0',
                                                            color: payment.status === 'completed' ? '#4caf50' : '#ff9800',
                                                            textTransform: 'capitalize',
                                                        }}>
                                                            {payment.status}
                                                        </span>
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                                        {payment.paymentType} • {payment.paymentMethod}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.25rem' }}>
                                                        {new Date(payment.createdAt).toLocaleString()}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <div style={{
                                        paddingTop: '1rem',
                                        borderTop: '2px solid #e0e0e0',
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: '1.2rem',
                                            fontWeight: 'bold',
                                        }}>
                                            <span>Total</span>
                                            <span>KES {selectedOrder.totalAmount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
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

export default Orders;
