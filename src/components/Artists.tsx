import React, { useState, useEffect } from "react";
import Header from "./layouts/Header";
import LoginModal from "./layouts/LoginModal";
import SignUpModal from "./layouts/SignUpModal";
import { artistsData } from "./artistsData";
import type { ArtistData } from "./artistsData";
import ArtPrintLogo from '../assets/ArtPrint Logo.png';

// Artist Card Component for Masonry
const ArtistCard: React.FC<{ artist: ArtistData; onClick: () => void }> = ({ artist, onClick }) => {
  const heights = [300, 340, 320, 360, 310, 350];
  const height = heights[artist.id % heights.length];
  
  return (
    <div 
      style={{
        borderRadius: 10,
        background: "#fff",
        boxShadow: "0 1px 6px #0002",
        marginBottom: window.innerWidth < 600 ? 16 : 24,
        breakInside: "avoid",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 4px 12px #0003";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 6px #0002";
      }}
    >
      <img
        src={artist.image}
        alt={artist.name}
        style={{
          width: "100%",
          height: `${height}px`,
          objectFit: "cover",
          display: "block"
        }}
      />
      <div style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        <div style={{
          fontWeight: 700, 
          fontSize: 18, 
          color: "#151f33",
          marginBottom: 4,
        }}>
          {artist.name}
        </div>
        <div style={{
          fontSize: 14,
          color: "#6b7280",
          marginBottom: 8,
        }}>
          {artist.specialty}
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          fontSize: 13,
          color: "#9ca3af",
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12 }}>📍</span>
            <span>{artist.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12 }}>🎨</span>
            <span>{artist.works}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Artists Component
const Artists: React.FC<{ 
  onNavigateToHome?: () => void;
  onNavigateToArtPrints?: () => void;
  onArtistClick?: (artistId: number) => void;
  onHeaderCartClick?: () => void;
  cartItemCount?: number;
}> = ({ onNavigateToHome, onNavigateToArtPrints, onArtistClick, onHeaderCartClick, cartItemCount = 0 }) => {
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
        onArtistsClick={() => {}}
        onHomeClick={onNavigateToHome}
        onCartClick={onHeaderCartClick}
        cartItemCount={cartItemCount}
        currentPage="artists"
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
          Featured Artists
        </h1>

        <div
          style={{
            columnCount: columns,
            columnGap: window.innerWidth < 600 ? 16 : 24,
            width: '100%',
          }}
        >
          {artistsData.map((artist) => (
            <ArtistCard 
              key={artist.id} 
              artist={artist}
              onClick={() => onArtistClick?.(artist.id)}
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
      {/* Footer Start */}
      <footer style={{
        background: '#fff', color: '#111', marginTop: 'auto', width: '100%',
        borderTop: '1px solid #e5e5e5', padding: '18px 0 15px 0',
        display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 15, position: 'relative', bottom: 0, left: 0,
        boxSizing: 'border-box', minHeight: 72, zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 120, justifyContent: 'flex-start'}}>
          <img src={ArtPrintLogo} alt="ArtPrint Logo" style={{ height: 46, width: 'auto', marginLeft: 24 }} />
        </div>
        <div style={{ flex: 2, textAlign: 'center', fontSize: 16, fontWeight: 400, letterSpacing: 0 }}>
          THE ESSENCE OF HERITAGE IN ART
        </div>
        <div style={{ flex: 1, textAlign: 'right', minWidth: 120, paddingRight: 24, fontSize: 14 }}>
          ©25 ArtPrint — All rights reserved
        </div>
      </footer>
      {/* Footer End */}
    </div>
  );
};

export default Artists;

