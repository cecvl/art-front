// Payment types matching backend models
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type PaymentType = 'deposit' | 'full' | 'remaining';

export interface Payment {
    id: string;
    orderId: string;
    buyerId: string;
    amount: number;
    paymentMethod: string; // "stripe", "mpesa", "simulated"
    status: PaymentStatus;
    transactionId: string;
    paymentType: PaymentType;
    providerData?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
    failedAt?: string;
    failureReason?: string;
}

export interface PaymentRequest {
    orderId: string;
    amount?: number; // Optional: if not provided, calculated from order
    paymentMethod: string; // "stripe", "mpesa", "simulated"
    paymentType: PaymentType; // "deposit", "full", "remaining"
    metadata?: Record<string, string>;
}

export interface PaymentResponse {
    paymentId: string;
    orderId: string;
    amount: number;
    status: PaymentStatus;
    transactionId: string;
    paymentUrl?: string; // For providers that need redirect
    providerData?: Record<string, any>;
}
