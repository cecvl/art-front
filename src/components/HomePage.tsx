import React, { useState } from "react";
import LoginModal from "./layouts/LoginModal";
import SignUpModal from "./layouts/SignUpModal";
import Header from "./layouts/Header";
import ArtCard from "./ArtCard";
import { artItems } from "./artData";

// Responsive helper
const getResponsivePadding = () =>
  (typeof window !== 'undefined' && window.innerWidth < 600) ? "0 8px" : "0";

// Hero Section
const Hero: React.FC = () => {
  const isSmall = typeof window !== 'undefined' && window.innerWidth < 500;
  const isMedium = typeof window !== 'undefined' && window.innerWidth < 700;
  
  return (
    <section style={{
      paddingTop: 2,
      paddingBottom: 10,
      paddingLeft: isMedium ? 16 : 28,
      paddingRight: isMedium ? 16 : 28,
      width: '100%',
      boxSizing: 'border-box',
      textAlign: 'center',
      background: 'transparent',
      margin: 0,
    }}>
      <h1 style={{
        fontSize: isSmall ? 36 : "4vw",
        fontWeight: 1400,
        letterSpacing: -2,
        lineHeight: 1,
      }}>
        Where Art Meets Creativity
      </h1>
      <div style={{
        borderRadius: 12,
        overflow: "hidden",
        background: "#f3f4f6",
        width: '100%',
        margin: 0,
        minHeight: 140,
        position: "relative",
        display: "block",
      }}>
        <img
          src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=960&q=80"
          style={{ width: "100%", objectFit: "cover", height: isSmall ? 180 : 360, display: "block" }}
          alt="Splash art"
        />
        <div style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: isSmall ? 10 : 32,
          color: "#fff",
          fontSize: isSmall ? 15 : 22,
          textShadow: "0 2px 12px #0009",
          background: "linear-gradient(to top, rgba(0,0,0,0.6) 50%, transparent)",
          padding: isSmall ? "0 10px" : "0 32px"
        }}>
          Art doesn't just fill a space — it defines it. It's a mirror to your taste, your mood, your moments. Here, every piece is more than a product — it's a conversation starter, a memory-maker, a quiet revolution on your wall. Discover art that reflects who you are — or who you're becoming.
        </div>
      </div>
    </section>
  );
};


const ArtGrid: React.FC<{ 
  onCardClick?: (artId: number) => void; 
  onCartClick?: (artId: number) => void;
  isItemInCart?: (artId: number) => boolean;
}> = ({ onCardClick, onCartClick, isItemInCart }) => {
  // Display first 12 items from artItems
  const displayedItems = artItems.slice(0, 12);
  
  // Safe window access
  const isSmall = typeof window !== 'undefined' && window.innerWidth < 600;
  const isMedium = typeof window !== 'undefined' && window.innerWidth < 700;
  const gridHorizontalPadding = isMedium ? 10 : 24;

  return (
    <section style={{
      padding: isSmall ? "18px 0 38px 0" : "36px 0 80px 0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      boxSizing: "border-box"
    }}>
      <div style={{
        width: "100%",
        paddingLeft: gridHorizontalPadding,
        paddingRight: gridHorizontalPadding,
        boxSizing: "border-box",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(4, 1fr)",
        gap: isSmall ? 12 : 32,
        justifyItems: "stretch",
        alignItems: "stretch"
      }}>
        {displayedItems.map((item) => (
          <ArtCard
            key={item.id}
            image={item.image}
            title={item.title}
            tags={item.tags}
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
    </section>
  );
};

// HomePage Assembly
const HomePage: React.FC<{ 
  onNavigateToArtPrints: () => void;
  onNavigateToArtists?: () => void;
  currentPage: "home" | "artprints" | "artists";
  onCardClick?: (artId: number) => void;
  onCartClick?: (artId: number) => void;
  onHeaderCartClick?: () => void;
  cartItemCount?: number;
  isItemInCart?: (artId: number) => boolean;
}> = ({ onNavigateToArtPrints, onNavigateToArtists, currentPage, onCardClick, onCartClick, onHeaderCartClick, cartItemCount = 0, isItemInCart }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  // force rerender on resize for live responsiveness
  const [, forceUpdate] = React.useState(0);
  React.useEffect(() => {
    const handleResize = () => forceUpdate(n=>n+1);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        margin: 0, // Remove any default margin
        padding: 0 // Remove any default padding
      }}>
      <Header
        onLoginClick={() => { setShowLogin(true); setShowSignUp(false); }}
        onSignUpClick={() => { setShowSignUp(true); setShowLogin(false); }}
        onArtPrintsClick={onNavigateToArtPrints}
        onArtistsClick={onNavigateToArtists}
        onCartClick={onHeaderCartClick}
        cartItemCount={cartItemCount}
        currentPage={currentPage}
      />
      <div
        style={{
          flex: 1,
          width: '100%',
          maxWidth: 1640,
          margin: '0 auto', // No unwanted margin here
          padding: getResponsivePadding(),
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Hero />
        <div style={{ minHeight: 10 }} />
        <ArtGrid onCardClick={onCardClick} onCartClick={onCartClick} isItemInCart={isItemInCart} />
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

export default HomePage;