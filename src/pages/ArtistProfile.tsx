import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/navigation/Header";
import Footer from "../components/navigation/Footer";
import ArtCard from "../components/artworks/ArtCard";
import { fetchArtistByUID, type Artist } from "../services/artists";
import { useCart } from "../context/CartContext";

const ArtistProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { cartItemCount, isItemInCart } = useCart();

    const [artist, setArtist] = useState<Artist | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadArtist = async () => {
            if (!id) {
                setError("Artist ID is missing");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await fetchArtistByUID(id);

                if (!data) {
                    setError("Artist not found");
                } else {
                    console.log("Loaded artist:", data);
                    setArtist(data);
                }
            } catch (err) {
                console.error("Error loading artist:", err);
                setError("Failed to load artist profile");
            } finally {
                setLoading(false);
            }
        };

        loadArtist();
    }, [id]);

    const isSmall = typeof window !== "undefined" && window.innerWidth < 600;
    const isMedium = typeof window !== "undefined" && window.innerWidth < 900;

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                <Header
                    onCartClick={() => navigate("/cart")}
                    cartItemCount={cartItemCount}
                    currentPage="artists"
                />
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                        Loading artist profile...
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !artist) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                <Header
                    onCartClick={() => navigate("/cart")}
                    cartItemCount={cartItemCount}
                    currentPage="artists"
                />
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20 }}>
                    <div style={{ textAlign: "center", padding: "40px", color: "#e53e3e" }}>
                        {error || "Artist not found"}
                    </div>
                    <button
                        onClick={() => navigate("/artists")}
                        style={{
                            padding: "12px 24px",
                            background: "#1a1a1a",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "16px",
                        }}
                    >
                        ← Back to Artists
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", width: "100vw", overflowX: "hidden", display: "flex", flexDirection: "column", background: "#fff" }}>
            <Header
                onCartClick={() => navigate("/cart")}
                cartItemCount={cartItemCount}
                currentPage="artists"
            />

            <div style={{ flex: 1, width: "100%", maxWidth: 1640, margin: "0 auto", padding: isSmall ? "16px" : "32px", boxSizing: "border-box" }}>
                {/* Back Button */}
                <button
                    onClick={() => navigate("/artists")}
                    style={{
                        marginBottom: 24,
                        padding: "8px 16px",
                        background: "transparent",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        color: "#333",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f5f5f5";
                        e.currentTarget.style.borderColor = "#999";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.borderColor = "#ddd";
                    }}
                >
                    ← Back to Artists
                </button>

                {/* Artist Profile Section */}
                <div style={{
                    background: "#fff",
                    borderRadius: 16,
                    overflow: "hidden",
                    marginBottom: 48,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}>
                    {/* Cover/Avatar Image */}
                    <div style={{
                        width: "100%",
                        height: isSmall ? 200 : 300,
                        background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                        position: "relative",
                        overflow: "hidden",
                    }}>
                        {artist.avatarUrl && (
                            <img
                                src={artist.avatarUrl}
                                alt={artist.name}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        )}
                    </div>

                    {/* Artist Info */}
                    <div style={{ padding: isSmall ? 24 : 40 }}>
                        <h1 style={{
                            fontSize: isSmall ? 32 : 48,
                            fontWeight: 700,
                            margin: 0,
                            marginBottom: 12,
                            color: "#171c23",
                            letterSpacing: -1,
                        }}>
                            {artist.name}
                        </h1>

                        {artist.description && (
                            <p style={{
                                fontSize: isSmall ? 16 : 18,
                                color: "#6b7280",
                                lineHeight: 1.6,
                                margin: 0,
                                marginBottom: 20,
                            }}>
                                {artist.description}
                            </p>
                        )}

                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontSize: 15,
                            color: "#9ca3af",
                        }}>
                            <span style={{ fontSize: 16 }}>🎨</span>
                            <span style={{ fontWeight: 600, color: "#374151" }}>
                                {artist.artworks?.length || 0}
                            </span>
                            <span>artwork{artist.artworks?.length !== 1 ? "s" : ""}</span>
                        </div>
                    </div>
                </div>

                {/* Artworks Section */}
                {artist.artworks && artist.artworks.length > 0 ? (
                    <>
                        <h2 style={{
                            fontSize: isSmall ? 24 : 32,
                            fontWeight: 700,
                            marginBottom: 24,
                            color: "#171c23",
                        }}>
                            Artworks
                        </h2>

                        <div style={{
                            columnCount: isSmall ? 1 : isMedium ? 2 : 3,
                            columnGap: isSmall ? 12 : 32,
                        }}>
                            {artist.artworks.map((artwork) => (
                                <div
                                    key={artwork.id}
                                    style={{
                                        breakInside: "avoid",
                                        marginBottom: isSmall ? 12 : 32,
                                        display: "inline-block",
                                        width: "100%",
                                    }}
                                >
                                    <ArtCard
                                        image={artwork.imageUrl}
                                        title={artwork.title}
                                        description={artwork.description}
                                        onClick={() => {
                                            // Navigate to artwork detail or open modal
                                            console.log("Clicked artwork:", artwork.id);
                                        }}
                                        artId={artwork.id}
                                        isInCart={isItemInCart?.(parseInt(artwork.id)) || false}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div style={{
                        textAlign: "center",
                        padding: "60px 20px",
                        color: "#9ca3af",
                        fontSize: 16,
                    }}>
                        No artworks available yet.
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default ArtistProfile;
