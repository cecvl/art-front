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
  const isSmall = typeof window !== "undefined" && window.innerWidth < 500;
  const isMedium = typeof window !== "undefined" && window.innerWidth < 700;

  return (
    <section
      style={{
        paddingTop: 2,
        paddingBottom: 10,
        paddingLeft: isMedium ? 16 : 28,
        paddingRight: isMedium ? 16 : 28,
        width: "100%",
        boxSizing: "border-box",
        textAlign: "center",
        background: "transparent",
        margin: 0,
      }}
    >
      <h1
        style={{
          fontSize: isSmall ? 36 : "4vw",
          fontWeight: 1400,
          letterSpacing: -2,
          lineHeight: 1,
        }}
      >
        Art for Every Space. Where Creativty Meets Collectors.
      </h1>

      <div
        style={{
          borderRadius: 12,
          overflow: "hidden",
          background: "#f3f4f6",
          width: "100%",
          minHeight: 140,
          position: "relative",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=960&q=80"
          style={{
            width: "100%",
            objectFit: "cover",
            height: isSmall ? 180 : 360,
            display: "block",
          }}
          alt="Splash art"
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: isSmall ? 10 : 32,
            color: "#fff",
            fontSize: isSmall ? 15 : 22,
            textShadow: "0 2px 12px #0009",
            background: "linear-gradient(to top, rgba(0,0,0,0.6) 50%, transparent)",
            padding: isSmall ? "0 10px" : "0 32px",
          }}
        >
          Art doesn't just fill a space — it defines it. Discover art that
          reflects who you are — or who you're becoming.
        </div>
      </div>
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
  const displayedItems = artworks.slice(0, 12);

  const isSmall = typeof window !== "undefined" && window.innerWidth < 600;
  const isMedium = typeof window !== "undefined" && window.innerWidth < 700;

  return (
    <section
      style={{
        padding: isSmall ? "18px 0 38px 0" : "36px 0 80px 0",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          paddingLeft: isMedium ? 10 : 24,
          paddingRight: isMedium ? 10 : 24,
          boxSizing: "border-box",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: isSmall ? 12 : 32,
        }}
      >
        {displayedItems.map((item) => (
          <ArtCard
            key={item.id}
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

    useEffect(() => {
      fetchArtworks().then((data) => setBackendArtworks(data));
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

          <ArtGrid
            artworks={backendArtworks}
            onCardClick={onCardClick}
            onCartClick={onCartClick}
            isItemInCart={isItemInCart}
          />
        </div>

        {/* FOOTER */}
        <Footer />
      </div>
    );
  };

export default HomePage;
