import { useState } from 'react';
import './ProductDetail.css';
import Header from '../navigation/Header';
import LoginModal from '../features/auth/LoginModal';
import SignUpModal from '../features/auth/SignUpModal';
import { artItems } from '../../services/artData';

const materials = [
  { key: 'canvas', name: 'Canvas' },
  { key: 'fineArtPaper', name: 'Fine Art Paper' },
  { key: 'galleryPoster', name: 'Gallery Poster' },
  { key: 'acrylic', name: 'Acrylic' },
  { key: 'metal', name: 'Metal' },
];

const sizes = [
  { key: 'mini', label: 'Mini', size: '12"x8"', price: 2800 },
  { key: 'small', label: 'Small', size: '18"x12"', price: 3200 },
  { key: 'medium', label: 'Medium', size: '26"x18"', price: 3800 },
  { key: 'large', label: 'Large', size: '40"x26"', price: 4500 },
];

const frames = [
  { key: 'noFrame', label: 'No Frame' },
  { key: 'black', label: 'Black' },
  { key: 'white', label: 'White' },
  { key: 'gold', label: 'Gold' },
  { key: 'blue', label: 'Blue' },
  { key: 'grey', label: 'Grey' },
];

interface ProductDetailProps {
  artItemId: number | null;
  onAddToCart: (product: {
    title: string;
    material: string;
    size: string;
    frame: string;
    image: string;
    price: number;
  }) => void;
  onNavigateToCart?: () => void;
}

export default function ProductDetail({ artItemId, onAddToCart, onNavigateToCart }: ProductDetailProps) {
  const artItem = artItemId ? artItems.find(item => item.id === artItemId) || artItems[0] : artItems[0];
  const [selectedMaterial, setMaterial] = useState(materials[0].key);
  const [selectedSize, setSize] = useState(sizes[3].key);
  const [selectedFrame, setFrame] = useState(frames[0].key);
  const currentPrice = sizes.find(s => s.key === selectedSize)?.price || 4500;

  const handleAdd = () => {
    const sizeObj = sizes.find(s => s.key === selectedSize);
    const product = {
      title: `${artItem.title} - ${materials.find(m => m.key === selectedMaterial)?.name || 'Canvas'} Print`,
      material: materials.find(m => m.key === selectedMaterial)?.name || '',
      size: sizeObj?.label || '',
      frame: frames.find(f => f.key === selectedFrame)?.label || '',
      image: artItem.image,
      price: sizeObj?.price || 4500,
    };
    onAddToCart(product);
    if (onNavigateToCart) {
      setTimeout(() => {
        onNavigateToCart();
      }, 300);
    }
  };

  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
      margin: 0,
      padding: 0
    }}>
      <Header
        onLoginClick={() => { setShowLogin(true); setShowSignUp(false); }}
        onSignUpClick={() => { setShowSignUp(true); setShowLogin(false); }}
        onArtistsClick={() => { }}
        onHomeClick={() => { }}
        onCartClick={onNavigateToCart}
        currentPage="home"
      />
      <div style={{
        flex: 1,
        width: '100%',
        maxWidth: 1400,
        margin: '0 auto',
        padding: '2rem',
        boxSizing: 'border-box',
      }}>
        <div className="product-layout">
          <div className="product-gallery">
            <div className="gallery-main">
              <img src={artItem.image} alt={artItem.title} />
            </div>
          </div>
          <div className="product-options">
            <h2>{artItem.title}</h2>
            <div className="artist-link">By {artItem.artist}</div>
            {artItem.description && (
              <p style={{ color: '#666', fontSize: '0.95em', marginTop: '0.5rem', lineHeight: 1.5 }}>
                {artItem.description}
              </p>
            )}
            <hr />
            <div className="option-section">
              <div className="option-label">Select Material:</div>
              <div className="option-group">
                {materials.map(mat => (
                  <button key={mat.key}
                    className={`option-btn ${selectedMaterial === mat.key ? 'selected' : ''}`}
                    onClick={() => setMaterial(mat.key)}>
                    {mat.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="option-section">
              <div className="option-label">Select Size: <span className="bold">{sizes.find(s => s.key === selectedSize)?.size}</span></div>
              <div className="option-group">
                {sizes.map(sz => (
                  <button key={sz.key}
                    className={`option-btn ${selectedSize === sz.key ? 'selected' : ''}`}
                    onClick={() => setSize(sz.key)}>
                    {sz.label}<br /><span className="size-detail">{sz.size}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="option-section">
              <div className="option-label">Select Frame:</div>
              <div className="option-group">
                {frames.map(f => (
                  <button key={f.key}
                    className={`option-btn frame ${selectedFrame === f.key ? 'selected' : ''}`}
                    onClick={() => setFrame(f.key)}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="product-pricing">
              <span className="actual-price">KES {currentPrice.toLocaleString()}</span>
            </div>
            <button className="add-to-cart-btn" onClick={handleAdd}>Add to Cart</button>
          </div>
        </div>
      </div>
      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onSignUpClick={() => { setShowLogin(false); setShowSignUp(true); }}
      />
      <SignUpModal
        open={showSignUp}
        onClose={() => setShowSignUp(false)}
        onLoginClick={() => { setShowSignUp(false); setShowLogin(true); }}
      />
    </div>
  );
}
