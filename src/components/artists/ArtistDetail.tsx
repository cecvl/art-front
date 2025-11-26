import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchArtworks, type Artwork } from "../../services/artworks";

const ArtistDetail = () => {
  const { id } = useParams(); // artist ID
  const navigate = useNavigate();

  const [artistArtworks, setArtistArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtworks()
      .then((all) => {
        const filtered = all.filter((a) => a.artistId === id);
        setArtistArtworks(filtered);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6">
      <button className="mb-4" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-4">Artist</h1>
      <p className="opacity-80 mb-6">
        Showing artworks by this artist.
      </p>

      {artistArtworks.length === 0 && (
        <div className="opacity-50">No artworks found for this artist.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {artistArtworks.map((art) => (
          <div
            key={art.id}
            className="cursor-pointer"
            onClick={() => navigate(`/product/${art.id}`)}
          >
            <img
              src={art.imageUrl}
              alt={art.title}
              className="rounded-xl shadow-md"
            />
            <h2 className="mt-2 font-medium">{art.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistDetail;
