const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export interface Artwork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  artistId: string;
  createdAt: string;
  isAvailable: boolean;
  eligiblePrintShops?: string[];
}

export interface PrintShop {
  id: string;
  name: string;
  description?: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
  contact: {
    email: string;
    phone: string;
    website?: string;
  };
  isActive: boolean;
  rating?: number;
  createdAt: string;
}

export async function fetchArtworks(): Promise<Artwork[]> {
  const res = await fetch(`${API_BASE}/artworks`, {
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
    eligiblePrintShops: artwork.eligiblePrintShops || artwork.EligiblePrintShops || [],
  }));
}

/**
 * Fetch all active print shops
 */
export async function fetchPrintShops(): Promise<PrintShop[]> {
  const res = await fetch(`${API_BASE}/printshops`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch print shops");
  }

  return res.json();
}

/**
 * Set eligible print shops for an artwork
 * @param artworkId - The artwork ID
 * @param eligiblePrintShops - Array of print shop IDs
 */
export async function setArtworkPrintShops(
  artworkId: string,
  eligiblePrintShops: string[]
): Promise<void> {
  const res = await fetch(`${API_BASE}/artworks/set-printshops`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      artworkId,
      eligiblePrintShops,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Failed to set eligible print shops');
  }
}
