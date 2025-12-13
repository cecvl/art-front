import type { Order, CheckoutRequest, CheckoutResponse } from '../types/order';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Get user's orders
 * @returns List of orders
 */
export const getOrders = async (): Promise<Order[]> => {
    const res = await fetch(`${API_BASE}/orders`, {
        credentials: 'include',
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to fetch orders');
    }

    return res.json();
};

/**
 * Get single order details
 * @param orderId Order ID
 * @returns Order details
 */
export const getOrderDetail = async (orderId: string): Promise<Order> => {
    const res = await fetch(`${API_BASE}/orders/${orderId}`, {
        credentials: 'include',
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to fetch order details');
    }

    return res.json();
};

/**
 * Create order from cart (checkout)
 * @param request Checkout request with delivery options
 * @returns Created order
 */
export const checkout = async (request?: CheckoutRequest): Promise<CheckoutResponse> => {
    const res = await fetch(`${API_BASE}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(request || {}),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to checkout');
    }

    return res.json();
};

/**
 * Select print shop for pending order
 * @param orderId Order ID
 * @param shopId Print shop ID to assign
 */
export const selectPrintShop = async (orderId: string, shopId: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/orders/select-printshop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ orderId, printShopId: shopId }),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to select print shop');
    }
};
