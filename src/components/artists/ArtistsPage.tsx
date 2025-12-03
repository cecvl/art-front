// src/pages/Artists.tsx
import React, { useState, useEffect } from "react";
import Header from "../navigation/Header";
import Footer from "../navigation/Footer";
import { fetchArtists, type Artist } from "../../services/artists";

// Artist Card Component for Masonry
const ArtistCard: React.FC<{ artist: Artist; onClick: () => void }> = ({ artist, onClick }) => {
  const heights = [300, 340, 320, 360, 310, 350];
  const height = heights[(artist.artworks?.length || 0) % heights.length] || 320;

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
        src={artist.avatarUrl || artist.artworks?.[0]?.imageUrl || ""}
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
        <div style={{ fontWeight: 700, fontSize: 18, color: "#151f33" }}>{artist.name}</div>
        <div style={{ fontSize: 14, color: "#6b7280" }}>{artist.description || "Contemporary Artist"}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: "#9ca3af" }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12 }}>🎨</span>
            <span>{artist.artworks?.length || 0} artworks</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Artists Page Component
const Artists: React.FC<{
  onNavigateToHome?: () => void;
  onArtistClick?: (artistUid: string) => void;
  onHeaderCartClick?: () => void;
  cartItemCount?: number;
}> = ({ onNavigateToHome, onArtistClick, onHeaderCartClick, cartItemCount = 0 }) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [, forceUpdate] = useState(0);

  // Fetch artists from backend
  useEffect(() => {
    fetchArtists().then(setArtists);
  }, []);

  // Handle resize for masonry
  useEffect(() => {
    const handleResize = () => forceUpdate(n => n + 1);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getColumns = () => {
    if (window.innerWidth < 600) return 1;
    if (window.innerWidth < 900) return 2;
    if (window.innerWidth < 1200) return 3;
    return 4;
  };

  const columns = getColumns();
  const padding = window.innerWidth < 600 ? 16 : window.innerWidth < 900 ? 24 : 32;

  return (
    <div style={{ minHeight: '100vh', width: '100vw', overflowX: 'hidden', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      {/* Header now manages its own modals */}
      <Header
        onHomeClick={onNavigateToHome}
        onCartClick={onHeaderCartClick}
        cartItemCount={cartItemCount}
        currentPage="artists"
      />
      <div style={{ width: '100%', maxWidth: 1400, margin: '0 auto', padding: `${padding}px`, boxSizing: 'border-box' }}>
        <h1 style={{ fontSize: window.innerWidth < 600 ? 32 : 48, fontWeight: 700, marginBottom: 32, color: "#171c23", letterSpacing: -1 }}>
          Featured Artists
        </h1>
        <div style={{ columnCount: columns, columnGap: window.innerWidth < 600 ? 16 : 24, width: '100%' }}>
          {artists.map((artist) => (
            <ArtistCard
              key={artist.uid}
              artist={artist}
              onClick={() => onArtistClick?.(artist.uid)}
            />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Artists;
