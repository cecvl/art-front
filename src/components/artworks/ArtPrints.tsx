import React, { useState, useEffect } from "react";
import Header from "../navigation/Header";
import ArtCard from "../artworks/ArtCard";
import { fetchArtworks } from "../../services/artworks";
import type { Artwork } from "../../services/artworks";
import ArtPrintLogo from '../../assets/PaaJuuPrints.svg';

// Heights for masonry effect
const getMasonryHeight = (index: number): number => {
  const heights = [280, 320, 300, 360, 290, 340, 310, 350, 300, 330, 280, 360, 290, 340, 320, 300, 350, 310];
  return heights[index % heights.length];
};

const ArtPrints: React.FC<{
  onCardClick?: (artId: string) => void;
  onCartClick?: (artId: string) => void;
  onHeaderCartClick?: () => void;
  cartItemCount?: number;
  isItemInCart?: (artId: string) => boolean;
}> = ({ onCardClick, onCartClick, onHeaderCartClick, cartItemCount = 0, isItemInCart }) => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    // Fetch artworks
    fetchArtworks()
      .then(setArtworks)
      .catch(err => console.error("Failed to fetch artworks:", err));
  }, []);

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
    <div style={{ minHeight: '100vh', width: '100vw', overflowX: 'hidden', display: 'flex', flexDirection: 'column', background: '#fff', margin: 0, padding: 0 }}>
      {/* Header now manages its own modals and navigation */}
      <Header
        onCartClick={onHeaderCartClick}
        cartItemCount={cartItemCount}
        currentPage="home"
      />

      <div style={{ width: '100%', maxWidth: 1400, margin: '0 auto', padding: `${padding}px`, boxSizing: 'border-box' }}>
        <h1 style={{ fontSize: window.innerWidth < 600 ? 32 : 48, fontWeight: 700, marginBottom: 32, color: "#171c23", letterSpacing: -1 }}>
          Art Prints Gallery
        </h1>

        <div style={{ columnCount: columns, columnGap: window.innerWidth < 600 ? 16 : 24, width: '100%' }}>
          {artworks.map((art, idx) => (
            <ArtCard
              key={art.id}
              image={art.imageUrl}
              title={art.title}
              height={getMasonryHeight(idx)}
              masonry
              onClick={onCardClick ? () => onCardClick(art.id) : undefined}
              onCartClick={onCartClick ? (e) => { e.stopPropagation(); onCartClick(art.id); } : undefined}
              artId={art.id}
              isInCart={isItemInCart ? isItemInCart(art.id) : false}
            />
          ))}
        </div>
      </div>

      <footer style={{ background: '#fff', color: '#111', marginTop: 'auto', width: '100%', borderTop: '1px solid #e5e5e5', padding: '18px 0 15px 0', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', fontSize: 15, position: 'relative', bottom: 0, left: 0, boxSizing: 'border-box', minHeight: 72, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 120, justifyContent: 'flex-start' }}>
          <img src={ArtPrintLogo} alt="ArtPrint Logo" style={{ height: 46, width: 'auto', marginLeft: 24 }} />
        </div>
        <div style={{ flex: 2, textAlign: 'center', fontSize: 16, fontWeight: 400, letterSpacing: 0 }}>
          THE ESSENCE OF HERITAGE IN ART
        </div>
        <div style={{ flex: 1, textAlign: 'right', minWidth: 120, paddingRight: 24, fontSize: 14 }}>
          ©25 ArtPrint — All rights reserved
        </div>
      </footer>
    </div>
  );
};

export default ArtPrints;
