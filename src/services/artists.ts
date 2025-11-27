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

export interface UserProfile {
  user: {
    uid: string;
    email: string;
    displayName?: string;
    name?: string;
    photoURL?: string;
    portfolioUrl?: string;
    instagram?: string;
    behance?: string;
  };
  artworks: Artwork[];
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

// Fetch authenticated user's profile (requires session cookie)
export const getProfile = async (): Promise<UserProfile | null> => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getprofile`, {
      method: 'GET',
      credentials: 'include', // Important: sends session cookie
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Not authenticated');
      }
      throw new Error(`Failed to fetch profile: ${res.status}`);
    }

    return (await res.json()) as UserProfile;
  } catch (err) {
    console.error("Error fetching profile:", err);
    return null;
  }
};
