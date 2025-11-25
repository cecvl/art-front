import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartComponent from '../components/features/cart/Cart';
import ProductDetail from '../components/artworks/ProductDetail';

export default function Cart() {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, addToCart } = useCart();
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [editingArtId, setEditingArtId] = useState<number | null>(null);

    const handleEditItem = (itemId: number, artId?: number) => {
        setEditingItemId(itemId);
        setEditingArtId(artId || null);
    };

    const handleUpdateItem = (product: {
        title: string;
        material: string;
        size: string;
        frame: string;
        image: string;
        price: number;
    }) => {
        if (editingItemId !== null) {
            // Remove the old item
            removeFromCart(editingItemId);
            // Add the updated item
            addToCart(product);
            // Close the modal
            setEditingItemId(null);
            setEditingArtId(null);
        }
    };

    return (
        <>
            <CartComponent
                cartItems={cartItems}
                onStartShopping={() => navigate('/')}
                onRemoveItem={removeFromCart}
                onUpdateQuantity={updateQuantity}
                onBack={() => navigate(-1)}
                onCheckout={() => navigate('/checkout')}
                onEditItem={handleEditItem}
            />
            {editingItemId !== null && (
                <ProductDetail
                    artItemId={editingArtId}
                    onAddToCart={handleUpdateItem}
                    onNavigateToCart={() => {
                        setEditingItemId(null);
                        setEditingArtId(null);
                    }}
                    hideHeader={true}
                />
            )}
        </>
    );
}
