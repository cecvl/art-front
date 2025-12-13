import type { PrintOrderOptions } from '../types/order';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export interface ShopMatch {
    shopId: string;
    shopName: string;
    serviceId: string;
    totalPrice: number;
    deliveryDays: number;
    matchScore: number;
    technology: string;
}

export interface MatchRequest {
    printOptions: PrintOrderOptions;
}

/**
 * Get matching print shops for order options
 * @param printOptions Print options for the order
 * @returns List of matching shops with pricing
 */
export const getOrderMatches = async (printOptions: PrintOrderOptions): Promise<ShopMatch[]> => {
    const res = await fetch(`${API_BASE}/printshops/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ printOptions }),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to get shop matches');
    }

    return res.json();
};

/**
 * Manually assign shop to order
 * @param orderId Order ID
 * @param shopId Print shop ID to assign
 */
export const assignShopToOrder = async (orderId: string, shopId: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/orders/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ orderId, printShopId: shopId }),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to assign shop to order');
    }
};
