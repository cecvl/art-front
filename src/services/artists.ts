export interface Artist {
  uid: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  artworks: Artwork[];
}

export interface Artwork {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  artistId: string;

}

// Fetch all artists
export const fetchArtists = async (): Promise<Artist[]> => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/artists`);
    if (!res.ok) throw new Error(`Failed to fetch artists: ${res.status}`);
    return (await res.json()) as Artist[];
  } catch (err) {
    console.error("Error fetching artists:", err);
    return [];
  }
};

// Fetch a single artist by UID
export const fetchArtistByUID = async (uid: string): Promise<Artist | null> => {
  const all = await fetchArtists();
  return all.find((a) => a.uid === uid) || null;
};
