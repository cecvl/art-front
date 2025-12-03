import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomePage from '../components/features/home/HomePage';
import { useCart } from '../context/CartContext';
import { fetchArtworks, type Artwork } from '../services/artworks';
import { toast } from 'sonner';
import ArtworkCustomizationModal from '../components/artworks/ArtworkCustomizationModal';

const Home = () => {
  const navigate = useNavigate();
  const { cartItemCount, isItemInCart, addToCart } = useCart();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  // Fetch artworks from backend
  useEffect(() => {
    fetchArtworks()
      .then((data) => setArtworks(data))
      .catch((err) => {
        console.error('Failed to fetch artworks', err);
        toast.error('Failed to load artworks');
      });
  }, []);

  // Add to cart handler - open modal
  const handleCartClick = (artId: string) => {
    const artItem = artworks.find((item) => item.id === artId);
    if (!artItem) return;

    setSelectedArtwork(artItem);
    setShowModal(true);
  };

  const handleAddToCart = (options: {
    artId: number;
    title: string;
    material: string;
    size: string;
    frame: string;
    image: string;
    price: number;
  }) => {
    addToCart(options);
    toast.success('Added to cart', {
      description: `${options.title} has been added to your cart`,
    });
  };

  return (
    <>
      <HomePage
        currentPage="home"
        onCardClick={(id) => navigate(`/product/${id}`)}
        onCartClick={handleCartClick}
        onHeaderCartClick={() => navigate('/cart')}
        cartItemCount={cartItemCount}
        isItemInCart={(artId: string) => isItemInCart(Number(artId))}
      />

      {selectedArtwork && (
        <ArtworkCustomizationModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedArtwork(null);
          }}
          artwork={{
            id: selectedArtwork.id,
            title: selectedArtwork.title,
            imageUrl: selectedArtwork.imageUrl,
          }}
          onAddToCart={handleAddToCart}
          mode="add"
        />
      )}
    </>
  );
};

export default Home;

