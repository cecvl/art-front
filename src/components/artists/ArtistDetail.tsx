import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchArtworks, type Artwork } from "../../services/artworks";
import { fetchArtistByUID, type Artist } from "../../services/artists";
import Header from "../navigation/Header";
import Footer from "../navigation/Footer";

const ArtistDetail = () => {
  const { id } = useParams(); // artist ID
  const navigate = useNavigate();

  const [artist, setArtist] = useState<Artist | null>(null);
  const [artistArtworks, setArtistArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    Promise.all([
      fetchArtistByUID(id),
      fetchArtworks()
    ])
      .then(([artistData, allArtworks]) => {
        setArtist(artistData);
        const filtered = allArtworks.filter((a) => a.artistId === id);
        setArtistArtworks(filtered);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: '#666' }}>Loading…</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', width: '100vw', overflowX: 'hidden', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <Header
        onHomeClick={() => navigate('/')}
        onCartClick={() => navigate('/cart')}
        currentPage="artists"
      />

      {/* Banner Section with Avatar as Background */}
      <div style={{
        width: '100%',
        height: 'clamp(200px, 40vw, 400px)',
        background: artist?.avatarUrl
          ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${artist.avatarUrl})`
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
        padding: 'clamp(1rem, 3vw, 2rem)',
        position: 'relative',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 'clamp(1rem, 2vw, 1.5rem)',
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          {/* Circular Avatar Overlay */}
          {artist?.avatarUrl && (
            <img
              src={artist.avatarUrl}
              alt={artist.name}
              style={{
                width: 'clamp(80px, 15vw, 120px)',
                height: 'clamp(80px, 15vw, 120px)',
                borderRadius: '50%',
                border: '4px solid white',
                objectFit: 'cover',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            />
          )}

          {/* Artist Info */}
          <div style={{ flex: 1, paddingBottom: '0.5rem' }}>
            <h1 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontWeight: 700,
              color: 'white',
              margin: 0,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}>
              {artist?.name || 'Artist'}
            </h1>
            {artist?.description && (
              <p style={{
                fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                color: 'rgba(255,255,255,0.95)',
                margin: '0.5rem 0 0 0',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              }}>
                {artist.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Artworks Section */}
      <div style={{
        flex: 1,
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
        }}>
          <h2 style={{
            fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
            fontWeight: 700,
            color: '#1a1a1a',
            margin: 0,
          }}>
            Artworks ({artistArtworks.length})
          </h2>
        </div>

        {artistArtworks.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: 'clamp(2rem, 5vw, 4rem)',
            color: '#666',
            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
          }}>
            No artworks found for this artist.
          </div>
        )}

        <div style={{
          columnCount: 'auto',
          columnWidth: 'clamp(280px, 33vw, 400px)',
          columnGap: 'clamp(12px, 2vw, 32px)',
        }}>
          {artistArtworks.map((art) => (
            <div
              key={art.id}
              style={{
                breakInside: 'avoid',
                marginBottom: 'clamp(12px, 2vw, 32px)',
                cursor: 'pointer',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                background: 'white',
              }}
              onClick={() => navigate(`/product/${art.id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              <img
                src={art.imageUrl}
                alt={art.title}
                style={{
                  width: '100%',
                  display: 'block',
                  objectFit: 'cover',
                }}
              />
              <div style={{ padding: 'clamp(0.75rem, 2vw, 1rem)' }}>
                <h3 style={{
                  fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
                  fontWeight: 600,
                  margin: '0 0 0.5rem 0',
                  color: '#1a1a1a',
                }}>
                  {art.title}
                </h3>
                {art.description && (
                  <p style={{
                    fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                    color: '#666',
                    margin: 0,
                    lineHeight: 1.5,
                  }}>
                    {art.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ArtistDetail;
