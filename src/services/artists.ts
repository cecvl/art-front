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
  eligiblePrintShops?: string[];
}

export interface UserProfile {
  user: {
    uid: string;
    email: string;
    displayName?: string;
    name?: string;
    photoURL?: string;
    description?: string;
    dateOfBirth?: string;
    avatarUrl?: string;
    backgroundUrl?: string;
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

// Update user profile (requires session cookie)
export const updateProfile = async (formData: FormData): Promise<void> => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/updateprofile`, {
      method: 'POST',
      credentials: 'include', // Important: sends session cookie for authentication
      body: formData, // multipart/form-data - don't set Content-Type header, browser will set it with boundary
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Not authenticated');
      }
      const errorData = await res.text();
      throw new Error(errorData || `Failed to update profile: ${res.status}`);
    }
  } catch (err) {
    console.error("Error updating profile:", err);
    throw err;
  }
};

// Upload artwork (requires session cookie and artist role)
export const uploadArtwork = async (formData: FormData): Promise<{ url: string }> => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/artworks/upload`, {
      method: 'POST',
      credentials: 'include', // Important: sends session cookie for authentication
      body: formData, // multipart/form-data - don't set Content-Type header
    });

    if (!res.ok) {
      if (res.status === 403) {
        throw new Error('Only artists can upload artworks');
      }
      const errorData = await res.text();
      throw new Error(errorData || `Upload failed: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Error uploading artwork:", err);
    throw err;
  }
};

