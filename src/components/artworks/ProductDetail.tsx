import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchArtworks, type Artwork } from "../../services/artworks";
import { useCart } from "../../context/CartContext";
import { toast } from "sonner";
import ArtworkCustomizationModal from "./ArtworkCustomizationModal";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [artItem, setArtItem] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Fetch selected artwork
  useEffect(() => {
    fetchArtworks()
      .then((all) => {
        const found = all.find((a) => a.id === id);
        setArtItem(found || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!artItem) return <div className="p-6">Artwork not found.</div>;

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
    toast.success("Added to cart", {
      description: `${artItem.title} has been added to your cart`
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button className="mb-4" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <img
        src={artItem.imageUrl}
        alt={artItem.title}
        className="w-full h-auto rounded-xl shadow-lg"
      />

      <h1 className="text-3xl font-bold mt-6">{artItem.title}</h1>
      <p className="opacity-80 mt-2">{artItem.description}</p>

      <button
        onClick={() => setShowModal(true)}
        className="mt-6 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
      >
        Customize & Add to Cart
      </button>

      <ArtworkCustomizationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        artwork={{
          id: artItem.id,
          title: artItem.title,
          imageUrl: artItem.imageUrl,
        }}
        onAddToCart={handleAddToCart}
        mode="add"
      />
    </div>
  );
};

export default ProductDetail;

