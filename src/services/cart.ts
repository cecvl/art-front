import type { CartItem as FrontendCartItem } from '../context/CartContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export interface BackendCartItem {
    artworkId: string;
    quantity: number;
    price: number;
    printOptions: {
        size: string;
        material: string;
        medium: string;
        frame: string;
        quantity: number;
        rushOrder: boolean;
    };
}

/**
 * Add item to backend cart
 * @param item Cart item to add
 */
export const addToBackendCart = async (item: BackendCartItem): Promise<void> => {
    console.log('📤 Adding to backend cart:', item);
    const res = await fetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(item),
    });

    console.log('📥 Backend cart response:', res.status, res.statusText);

    if (!res.ok) {
        const error = await res.text();
        console.error('❌ Failed to add to cart:', error);
        throw new Error(`Failed to add to cart (${res.status}): ${error || res.statusText}`);
    }

    console.log('✅ Item added to backend cart');
};

/**
 * Sync frontend cart items to backend cart
 * This is needed before checkout since backend reads from its own cart
 * @param frontendCartItems Frontend cart items to sync
 */
export const syncCartToBackend = async (frontendCartItems: FrontendCartItem[]): Promise<void> => {
    // Clear backend cart first by getting it and removing all items
    // Then add all frontend items

    for (const item of frontendCartItems) {
        const backendItem: BackendCartItem = {
            artworkId: item.artId?.toString() || item.id.toString(),
            quantity: item.quantity,
            price: item.price,
            printOptions: {
                size: item.size,
                material: item.material,
                medium: 'paper', // Default medium
                frame: item.frame,
                quantity: item.quantity,
                rushOrder: false, // Default no rush
            },
        };

        await addToBackendCart(backendItem);
    }
};

/**
 * Get backend cart
 */
export const getBackendCart = async (): Promise<any> => {
    const res = await fetch(`${API_BASE}/cart`, {
        credentials: 'include',
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to get cart');
    }

    return res.json();
};

/**
 * Remove item from backend cart
 */
export const removeFromBackendCart = async (artworkId: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/cart/remove`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ artworkId }),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to remove from cart');
    }
};
