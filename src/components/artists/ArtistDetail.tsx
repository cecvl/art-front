import React, { useState, useEffect } from "react";
import Header from "../navigation/Header";
import LoginModal from "../features/auth/LoginModal";
import SignUpModal from "../features/auth/SignUpModal";
import { artistsData } from "../../services/artistsData";
import ArtCard from "../artworks/ArtCard";
import { artItems } from "../../services/artData";

// Heights for masonry effect
const getMasonryHeight = (index: number): number => {
  const heights = [280, 320, 300, 360, 290, 340, 310, 350, 300, 330, 280, 360];
  return heights[index % heights.length];
};

// ArtistDetail Component
const ArtistDetail: React.FC<{ 
  artistId: number;
  onNavigateToHome?: () => void;
  onNavigateToArtPrints?: () => void;
  onNavigateToArtists?: () => void;
  onCardClick?: (artId: number) => void;
  onCartClick?: (artId: number) => void;
  onHeaderCartClick?: () => void;
  cartItemCount?: number;
  isItemInCart?: (artId: number) => boolean;
}> = ({ artistId, onNavigateToHome, onNavigateToArtPrints, onNavigateToArtists, onCardClick, onCartClick, onHeaderCartClick, cartItemCount = 0, isItemInCart }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [, setForceUpdate] = useState(0);
  
  const artist = artistsData.find(a => a.id === artistId) || artistsData[0];
  
  useEffect(() => {
    const handleResize = () => setForceUpdate(n => n + 1);
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
  const getPadding = () => {
    if (window.innerWidth < 600) return 16;
    if (window.innerWidth < 900) return 24;
    return 32;
  };
  const padding = getPadding();

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
          position: 'relative',
        }}
      >
        {/* Back Arrow Button */}
        <button
          onClick={onNavigateToArtists}
          style={{
            position: 'absolute',
            top: window.innerWidth < 600 ? 16 : 24,
            right: window.innerWidth < 600 ? 16 : 24,
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease',
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f9fafb';
            e.currentTarget.style.borderColor = '#d1d5db';
            e.currentTarget.style.transform = 'translateX(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
          aria-label="Back to Featured Artists"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="#151f33"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {/* Artist Profile Section */}
        <div style={{
          display: 'flex',
          flexDirection: window.innerWidth < 900 ? 'column' : 'row',
          gap: 32,
          marginBottom: 48,
          alignItems: window.innerWidth < 900 ? 'center' : 'flex-start',
        }}>
          <img
            src={artist.image}
            alt={artist.name}
            style={{
              width: window.innerWidth < 900 ? '100%' : 300,
              maxWidth: 300,
              height: 300,
              objectFit: 'cover',
              borderRadius: 12,
              boxShadow: "0 4px 12px #0002",
            }}
          />
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
            <h1 style={{
              fontSize: window.innerWidth < 600 ? 32 : 48,
              fontWeight: 700,
              color: "#171c23",
              letterSpacing: -1,
              margin: 0,
            }}>
              {artist.name}
            </h1>
            <div style={{
              fontSize: 20,
              color: "#6b7280",
              fontWeight: 500,
            }}>
              {artist.specialty}
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              fontSize: 15,
              color: "#9ca3af",
              marginTop: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>📍</span>
                <span>{artist.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>🎨</span>
                <span>{artist.works}</span>
              </div>
            </div>
            <div style={{
              fontSize: 16,
              lineHeight: 1.6,
              color: "#4b5563",
              marginTop: 16,
            }}>
              {artist.bio}
            </div>
          </div>
        </div>

        {/* Artist's Art Gallery */}
        <h2 style={{
          fontSize: window.innerWidth < 600 ? 24 : 36,
          fontWeight: 700,
          marginBottom: 32,
          color: "#171c23",
          letterSpacing: -0.5,
        }}>
          Artwork Collection
        </h2>

        <div
          style={{
            columnCount: columns,
            columnGap: window.innerWidth < 600 ? 16 : 24,
            width: '100%',
          }}
        >
          {artist.artImages.map((image, idx) => {
            // Find matching art item by image path or use a default
            const artItem = artItems.find(item => 
              item.image.includes(image.split('/').pop() || '') || 
              image.includes(item.image.split('/').pop() || '')
            ) || artItems[idx % artItems.length];
            
            return (
              <ArtCard
                key={`${artistId}-${idx}-${image}`}
                image={artItem.image}
                title={artItem.title}
                tags={artItem.tags}
                height={getMasonryHeight(idx)}
                masonry={true}
                onClick={onCardClick ? () => onCardClick(artItem.id) : undefined}
                onCartClick={onCartClick ? (e) => {
                  e.stopPropagation();
                  onCartClick(artItem.id);
                } : undefined}
                artId={artItem.id}
                isInCart={isItemInCart ? isItemInCart(artItem.id) : false}
              />
            );
          })}
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

export default ArtistDetail;

