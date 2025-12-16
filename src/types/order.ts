// Order types matching backend models
// IMPORTANT: Backend Go struct doesn't have JSON tags, so fields are capitalized
export interface Order {
    OrderID: string;
    BuyerID: string;
    PrintShopID: string;
    Items: CartItem[];
    PrintOptions: PrintOrderOptions;
    TotalAmount: number;
    PaymentMethod?: string;
    TransactionID?: string;
    PaymentStatus: 'unpaid' | 'partial' | 'paid';
    PaymentID?: string;
    DeliveryStatus: 'pending' | 'processing' | 'ready' | 'delivered';
    DeliveryMethod?: 'pickup' | 'shipping';
    PickupLocation?: string;
    Status: 'pending' | 'confirmed' | 'processing' | 'ready' | 'completed';
    CreatedAt: string;
    UpdatedAt: string;
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

