export interface Artwork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  artistId: string;
  createdAt: string;
  isAvailable: boolean;
}

export async function fetchArtworks(): Promise<Artwork[]> {
  const res = await fetch("http://localhost:3001/artworks", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch artworks");
  }

  const data = await res.json();

  // Transform API response to match our interface
  return data.map((artwork: any) => ({
    id: artwork.ArtworkID || artwork.id,
    title: artwork.Title || artwork.title || '',
    description: artwork.Description || artwork.description || '',
    imageUrl: artwork.ImageURL || artwork.imageUrl || '',
    artistId: artwork.ArtistID || artwork.artistId || '',
    createdAt: artwork.CreatedAt || artwork.createdAt || '',
    isAvailable: artwork.IsAvailable !== undefined ? artwork.IsAvailable : true,
  }));
}
