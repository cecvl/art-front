import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartComponent from '../components/features/cart/Cart';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity } = useCart();

    return (
        <CartComponent
            cartItems={cartItems}
            onStartShopping={() => navigate('/')}
            onRemoveItem={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onBack={() => navigate(-1)}
            onCheckout={() => navigate('/checkout')}
        />
    );
};

export default Cart;
