import React, { useState, useEffect } from "react";
import Header from "./layouts/Header";
import LoginModal from "./layouts/LoginModal";
import SignUpModal from "./layouts/SignUpModal";
import ArtCard from "./ArtCard";
import { artItems } from "./artData";

// Heights for masonry effect
const getMasonryHeight = (index: number): number => {
  const heights = [280, 320, 300, 360, 290, 340, 310, 350, 300, 330, 280, 360, 290, 340, 320, 300, 350, 310];
  return heights[index % heights.length];
};

// ArtPrints Component
const ArtPrints: React.FC<{ 
  onBack: () => void;
  onNavigateToHome?: () => void;
  onNavigateToArtPrints?: () => void;
  onNavigateToArtists?: () => void;
  onCardClick?: (artId: number) => void;
  onCartClick?: (artId: number) => void;
  onHeaderCartClick?: () => void;
  cartItemCount?: number;
  isItemInCart?: (artId: number) => boolean;
}> = ({ onBack, onNavigateToHome, onNavigateToArtPrints, onNavigateToArtists, onCardClick, onCartClick, onHeaderCartClick, cartItemCount = 0, isItemInCart }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [, forceUpdate] = useState(0);
  
  useEffect(() => {
    const handleResize = () => forceUpdate(n => n + 1);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate number of columns based on screen width
  const getColumns = () => {
    if (window.innerWidth < 600) return 1;
    if (window.innerWidth < 900) return 2;
    if (window.innerWidth < 1200) return 3;
    return 4;
  };

  const columns = getColumns();
  const padding = window.innerWidth < 600 ? 16 : window.innerWidth < 900 ? 24 : 32;

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        margin: 0,
        padding: 0
      }}
    >
      <Header
        onLoginClick={() => { setShowLogin(true); setShowSignUp(false); }}
        onSignUpClick={() => { setShowSignUp(true); setShowLogin(false); }}
        onArtPrintsClick={onNavigateToArtPrints || (() => {})}
        onArtistsClick={onNavigateToArtists}
        onHomeClick={onNavigateToHome || onBack}
        onCartClick={onHeaderCartClick}
        cartItemCount={cartItemCount}
        currentPage="artprints"
      />
      <div
        style={{
          width: '100%',
          maxWidth: 1400,
          margin: '0 auto',
          padding: `${padding}px`,
          boxSizing: 'border-box',
        }}
      >
        <h1 style={{
          fontSize: window.innerWidth < 600 ? 32 : 48,
          fontWeight: 700,
          marginBottom: 32,
          color: "#171c23",
          letterSpacing: -1,
        }}>
          Art Prints Gallery
        </h1>

        <div
          style={{
            columnCount: columns,
            columnGap: window.innerWidth < 600 ? 16 : 24,
            width: '100%',
          }}
        >
          {artItems.map((item, idx) => (
            <ArtCard
              key={item.id}
              image={item.image}
              title={item.title}
              tags={item.tags}
              height={getMasonryHeight(idx)}
              masonry={true}
              onClick={onCardClick ? () => onCardClick(item.id) : undefined}
              onCartClick={onCartClick ? (e) => {
                e.stopPropagation();
                onCartClick(item.id);
              } : undefined}
              artId={item.id}
              isInCart={isItemInCart ? isItemInCart(item.id) : false}
            />
          ))}
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
};

export default ArtPrints;

