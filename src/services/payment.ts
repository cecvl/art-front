import type { Payment, PaymentRequest, PaymentResponse } from '../types/payment';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Create a new payment for an order
 * @param request Payment request details
 * @returns Payment response with payment ID and transaction details
 */
export const createPayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
    const res = await fetch(`${API_BASE}/payments/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(request),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to create payment');
    }

    return res.json();
};

/**
 * Verify payment status
 * @param paymentId Payment ID to verify
 * @returns Updated payment details
 */
export const verifyPayment = async (paymentId: string): Promise<Payment> => {
    const res = await fetch(`${API_BASE}/payments/verify?paymentId=${paymentId}`, {
        credentials: 'include',
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to verify payment');
    }

    return res.json();
};

/**
 * Get payment history for user or specific order
 * @param orderId Optional order ID to filter payments
 * @returns List of payments
 */
export const getPayments = async (orderId?: string): Promise<Payment[]> => {
    const url = orderId
        ? `${API_BASE}/payments?orderId=${orderId}`
        : `${API_BASE}/payments`;

    const res = await fetch(url, {
        credentials: 'include',
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to fetch payments');
    }

    return res.json();
};

/**
 * Get single payment details
 * @param paymentId Payment ID
 * @returns Payment details
 */
export const getPaymentDetail = async (paymentId: string): Promise<Payment> => {
    const res = await fetch(`${API_BASE}/payments/${paymentId}`, {
        credentials: 'include',
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to fetch payment details');
    }

    return res.json();
};
