// Order types matching backend models
export interface Order {
    orderId: string;
    buyerId: string;
    printShopId: string;
    items: CartItem[];
    printOptions: PrintOrderOptions;
    totalAmount: number;
    paymentMethod?: string;
    transactionId?: string;
    paymentStatus: 'unpaid' | 'partial' | 'paid';
    paymentId?: string;
    deliveryStatus: 'pending' | 'processing' | 'ready' | 'delivered';
    deliveryMethod?: 'pickup' | 'shipping';
    pickupLocation?: string;
    status: 'pending' | 'confirmed' | 'processing' | 'ready' | 'completed';
    createdAt: string;
    updatedAt: string;
}

export interface CartItem {
    artworkId: string;
    quantity: number;
    price: number;
    printOptions?: PrintOrderOptions;
}

export interface PrintOrderOptions {
    size: string;
    material: string;
    medium: string;
    frame: string;
    quantity: number;
    rushOrder: boolean;
}

export interface CheckoutRequest {
    deliveryMethod?: 'pickup' | 'shipping';
    pickupLocation?: string;
}

// Backend returns Order directly, not wrapped in {order: ...}
export type CheckoutResponse = Order;
