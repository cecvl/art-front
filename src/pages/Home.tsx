import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomePage from '../components/features/home/HomePage';
import { useCart } from '../context/CartContext';
import { fetchArtworks, type Artwork } from '../services/artworks';
import { toast } from 'sonner';

const Home = () => {
  const navigate = useNavigate();
  const { cartItemCount, isItemInCart, addToCart } = useCart();
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  // Fetch artworks from backend
  useEffect(() => {
    fetchArtworks()
      .then((data) => setArtworks(data))
      .catch((err) => {
        console.error('Failed to fetch artworks', err);
        toast.error('Failed to load artworks');
      });
  }, []);

  // Add to cart handler
  const handleCartClick = (artId: string) => {
    const artItem = artworks.find((item) => item.id === artId);
    if (!artItem) return;

    // Convert string ID to number to satisfy CartContext
    addToCart({
      ...artItem,
      artId: Number(artItem.id),
      price: 4500, // Use your existing price field if available
      material: 'Canvas', // or from artItem if present
      size: 'Large',      // or from artItem
      frame: 'No Frame',  // or from artItem
    });
    toast.success('Added to cart', {
      description: `${artItem.title} has been added to your cart`,
    });
  };

  return (
    <HomePage
      currentPage="home"
      onCardClick={(id) => navigate(`/product/${id}`)}
      onCartClick={handleCartClick}
      onHeaderCartClick={() => navigate('/cart')}
      cartItemCount={cartItemCount}
      isItemInCart={(artId: string) => isItemInCart(Number(artId))}
    />
  );
};

export default Home;
