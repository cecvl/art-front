import '../../../styles/Cart.css';
import type { CartItem } from '../../../context/CartContext';

// Placeholder cart items (empty for demo, structure for sample)
const sampleCartItems: CartItem[] = [
  // Uncomment for demo state with product
  // {
  //   id: 1,
  //   title: 'Haircut - Canvas Print',
  //   material: 'Canvas',
  //   size: 'Large',
  //   frame: 'No Frame',
  //   image: '/placeholder1.jpg',
  //   price: 105.00,
  //   qty: 1,
  // },
];

interface CartProps {
  cartItems?: CartItem[];
  onStartShopping?: () => void;
  onRemoveItem?: (id: number) => void;
  onUpdateQuantity?: (id: number, qty: number) => void;
  onBack?: () => void;
  onCheckout?: () => void;
  onEditItem?: (id: number, artId?: number) => void;
}

export default function Cart({
  cartItems = sampleCartItems,
  onStartShopping,
  onRemoveItem,
  onUpdateQuantity,
  onBack,
  onCheckout,
  onEditItem,
}: Readonly<CartProps>) {
  const total = cartItems.reduce((acc, c) => {
    const price = Number(c.price) || 0;
    const quantity = Number(c.quantity) || 0;
    return acc + (price * quantity);
  }, 0).toFixed(2);
  const isEmpty = cartItems.length === 0;

  return (
    <div className="cart-page">
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '1.6rem',
            right: '2.3rem',
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease',
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f9fafb';
            e.currentTarget.style.borderColor = '#d1d5db';
            e.currentTarget.style.transform = 'translateX(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
          aria-label="Go back"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="#151f33"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      <h2>Cart</h2>
      {isEmpty ? (
        <div className="empty-cart">
          <div>Your cart is empty.</div>
          <button className="start-shopping-btn" onClick={onStartShopping}>Start Shopping</button>
        </div>
      ) : (
        <>
          <div className="cart-items-list">
            {cartItems.map(item => (
              <div className="cart-item" key={item.id}>
                {item.image && <img src={item.image} alt="art" className="cart-thumb" />}
                <div className="cart-details">
                  <div className="cart-title">{item.title}</div>
                  <div className="cart-options">Material: <b>{item.material}</b> | Size: <b>{item.size}</b> | Frame: <b>{item.frame}</b></div>
                  <div className="cart-price-row">
                    <span className="cart-price">KES {item.price.toFixed(2)}</span>
                  </div>
                  <div className="cart-actions">
                    <div className="qty-row">
                      <button
                        className="qty-btn"
                        title="Decrease"
                        onClick={() => onUpdateQuantity?.(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="qty">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        title="Increase"
                        onClick={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    {onEditItem && (
                      <button
                        className="edit-item-btn"
                        onClick={() => onEditItem(item.id, item.artId)}
                        title="Edit item"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
                <button
                  className="remove-item-btn"
                  onClick={() => onRemoveItem?.(item.id)}
                  aria-label="Remove item"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <span className="total-label">Total</span>
            <span className="total-amount">KES {total}</span>
          </div>
          <button
            className="checkout-btn"
            disabled={cartItems.length === 0}
            onClick={onCheckout}
          >
            Checkout
          </button>
        </>
      )}
    </div>
  );
}
