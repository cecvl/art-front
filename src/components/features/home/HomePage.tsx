import React, { useState, useEffect } from "react";
import Header from "../../navigation/Header";
import Footer from "../../navigation/Footer";
import ArtCard from "../../artworks/ArtCard";
import { fetchArtworks } from "../../../services/artworks";
import type { Artwork } from "../../../services/artworks";

// Responsive padding
const getResponsivePadding = () =>
  (typeof window !== "undefined" && window.innerWidth < 600 ? "0 8px" : "0");

// --- HERO SECTION ---
const Hero: React.FC = () => {
  return (
    <section
      style={{
        paddingTop: 'clamp(8px, 2vw, 16px)',
        paddingBottom: 'clamp(20px, 4vw, 40px)',
        paddingLeft: 'clamp(16px, 4vw, 28px)',
        paddingRight: 'clamp(16px, 4vw, 28px)',
        width: '100%',
        boxSizing: 'border-box',
        textAlign: 'center',
        background: 'transparent',
        margin: 0,
      }}
    >
      <h1
        style={{
          fontSize: 'clamp(32px, 8vw, 72px)',
          fontWeight: 700,
          letterSpacing: 'clamp(-1px, -0.05em, -2px)',
          lineHeight: 1.1,
          marginBottom: 'clamp(12px, 3vw, 20px)',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
        }}
      >
        Art for Every Space. Where Creativty Meets Collectors.
      </h1>

      <h2
        style={{
          fontSize: 'clamp(14px, 3vw, 24px)',
          fontWeight: 400,
          color: '#666',
          lineHeight: 1.6,
          maxWidth: 'min(90%, 800px)',
          margin: '0 auto',
          padding: '0 clamp(12px, 3vw, 20px)',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
        }}
      >
        Transform your walls with meaningful creations made by diverse artists. Find art that reflects who you are and who you love.
      </h2>
    </section>
  );
};

// --- ART GRID (backend data only) ---
const ArtGrid: React.FC<{
  artworks: Artwork[];
  onCardClick?: (artId: string) => void;
  onCartClick?: (artId: string) => void;
  isItemInCart?: (artId: string) => boolean;
}> = ({ artworks, onCardClick, onCartClick, isItemInCart }) => {
  // Display all artworks - no limit (Pinterest-style)
  const displayedItems = artworks;

  return (
    <section
      style={{
        padding: 'clamp(18px, 4vw, 36px) 0 clamp(38px, 8vw, 80px) 0',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          paddingLeft: 'clamp(10px, 2vw, 24px)',
          paddingRight: 'clamp(10px, 2vw, 24px)',
          boxSizing: 'border-box',
          columnCount: 'auto',
          columnWidth: 'clamp(280px, 33vw, 400px)',
          columnGap: 'clamp(12px, 2vw, 32px)',
        }}
      >
        {displayedItems.map((item) => (
          <div
            key={item.id}
            style={{
              breakInside: 'avoid',
              marginBottom: 'clamp(12px, 2vw, 32px)',
              display: 'inline-block',
              width: '100%',
            }}
          >
            <ArtCard
              image={item.imageUrl}
              title={item.title}
              description={item.description}
              onClick={() => onCardClick?.(item.id)}
              onCartClick={(e) => {
                e.stopPropagation();
                onCartClick?.(item.id);
              }}
              artId={item.id}
              isInCart={isItemInCart?.(item.id)}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

// --- HOMEPAGE WRAPPER — NO ARTWORK PROPS ---
const HomePage: React.FC<{
  currentPage: "home" | "artists";
  onCardClick?: (artId: string) => void;
  onCartClick?: (artId: string) => void;
  onHeaderCartClick?: () => void;
  cartItemCount?: number;
  isItemInCart?: (artId: string) => boolean;
}> = ({
  currentPage,
  onCardClick,
  onCartClick,
  onHeaderCartClick,
  cartItemCount = 0,
  isItemInCart,
}) => {
    // Backend artworks ONLY
    const [backendArtworks, setBackendArtworks] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const loadArtworks = async () => {
        try {
          setLoading(true);
          const data = await fetchArtworks();
          console.log('Fetched artworks:', data.length, 'items');
          console.log('Artworks data:', data);
          setBackendArtworks(data);
          setError(null);
        } catch (err) {
          console.error('Error fetching artworks:', err);
          setError('Failed to load artworks');
        } finally {
          setLoading(false);
        }
      };

      loadArtworks();
    }, []);

    return (
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          background: "#fff",
        }}
      >
        {/* Header now manages its own modals and navigation */}
        <Header
          onCartClick={onHeaderCartClick}
          cartItemCount={cartItemCount}
          currentPage={currentPage}
        />

        <div
          style={{
            flex: 1,
            width: "100%",
            maxWidth: 1640,
            margin: "0 auto",
            padding: getResponsivePadding(),
            boxSizing: "border-box",
          }}
        >
          <Hero />

          {loading && (
            <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
              Loading artworks...
            </div>
          )}

          {error && (
            <div style={{ textAlign: "center", padding: "40px", color: "#e53e3e" }}>
              {error}
            </div>
          )}

          {!loading && !error && (
            <ArtGrid
              artworks={backendArtworks}
              onCardClick={onCardClick}
              onCartClick={onCartClick}
              isItemInCart={isItemInCart}
            />
          )}
        </div>

        {/* FOOTER */}
        <Footer />
      </div>
    );
  };

export default HomePage;
