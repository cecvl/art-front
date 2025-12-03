import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartComponent from '../components/features/cart/Cart';
import Footer from '../components/navigation/Footer';
import ArtworkCustomizationModal from '../components/artworks/ArtworkCustomizationModal';
import { fetchArtworks, type Artwork } from '../services/artworks';

export default function Cart() {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, addToCart } = useCart();
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [artworks, setArtworks] = useState<Artwork[]>([]);

    // Fetch artworks for editing
    useEffect(() => {
        fetchArtworks()
            .then((data) => setArtworks(data))
            .catch((err) => console.error('Failed to fetch artworks', err));
    }, []);

    const handleEditItem = (itemId: number, artId?: number) => {
        // Find the cart item
        const cartItem = cartItems.find((item) => item.id === itemId);
        if (!cartItem) {
            console.error('Cart item not found');
            return;
        }

        // Try to find the original artwork if artId is provided
        let artwork = null;
        if (artId && !isNaN(artId)) {
            artwork = artworks.find((art) =>
                art.id === String(artId) || art.id === artId.toString()
            );
        }

        // If artwork not found, create a minimal artwork object from cart item
        if (!artwork) {
            artwork = {
                id: artId ? String(artId) : String(cartItem.id),
                title: cartItem.title,
                imageUrl: cartItem.image || '',
                description: '',
                artistId: '',
                createdAt: '',
                isAvailable: true,
            };
        }

        setEditingItemId(itemId);
        setEditingArtwork(artwork);
        setShowModal(true);
    };

    const handleUpdateItem = (options: {
        artId: number;
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
            addToCart(options);
            // Close the modal
            setShowModal(false);
            setEditingItemId(null);
            setEditingArtwork(null);
        }
    };

    // Get current item options for editing
    const getCurrentItemOptions = () => {
        if (!editingItemId) return undefined;
        const item = cartItems.find((i) => i.id === editingItemId);
        if (!item) return undefined;
        return {
            material: item.material,
            size: item.size,
            frame: item.frame,
        };
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div style={{ flex: 1 }}>
                <CartComponent
                    cartItems={cartItems}
                    onStartShopping={() => navigate('/')}
                    onRemoveItem={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                    onBack={() => navigate(-1)}
                    onCheckout={() => navigate('/checkout')}
                    onEditItem={handleEditItem}
                />
            </div>
            <Footer />

            {editingArtwork && (
                <ArtworkCustomizationModal
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setEditingItemId(null);
                        setEditingArtwork(null);
                    }}
                    artwork={{
                        id: editingArtwork.id,
                        title: editingArtwork.title,
                        imageUrl: editingArtwork.imageUrl,
                    }}
                    onAddToCart={handleUpdateItem}
                    initialOptions={getCurrentItemOptions()}
                    mode="edit"
                />
            )}
        </div>
    );
}

