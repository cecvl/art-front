
import { useNavigate } from 'react-router-dom';
import HomePage from './HomePage';
import { useCart } from '../context/CartContext';
import { artItems } from '../services/artData';
import { toast } from 'sonner';

const Home = () => {
    const navigate = useNavigate();
    const { cartItemCount, isItemInCart, addToCart } = useCart();

    const handleCartClick = (artId: number) => {
        const artItem = artItems.find(item => item.id === artId);
        if (artItem) {
            const defaultProduct = {
                artId: artItem.id, // Include the original art ID
                title: `${artItem.title} - Canvas Print`,
                material: 'Canvas',
                size: 'Large',
                frame: 'No Frame',
                image: artItem.image,
                price: 4500, // Default price in KES
            };
            addToCart(defaultProduct);
            toast.success('Added to cart', {
                description: `${artItem.title} has been added to your cart`,
            });
        }
    };

    return (
        <HomePage
            currentPage="home"
            onNavigateToArtists={() => navigate('/artists')}
            onCardClick={(id) => navigate(`/product/${id}`)}
            onCartClick={handleCartClick}
            onHeaderCartClick={() => navigate('/cart')}
            cartItemCount={cartItemCount}
            isItemInCart={isItemInCart}
        />
    );
};

export default Home;
