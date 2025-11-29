// Print Shop Type Definitions

// Shop Profile
export interface PrintShop {
    id: string;
    ownerId: string;
    name: string;
    description?: string;
    location: string;
    contactEmail: string;
    contactPhone: string;
    isActive: boolean;
    rating?: number;
    createdAt: string;
    updatedAt?: string;
}

// Print Service
export interface PrintService {
    id: string;
    shopId: string;
    name: string;
    description: string;
    technologyType: string; // e.g., "Digital", "Giclée", "Screen Print"
    basePrice: number;
    isActive: boolean;
    createdAt: string;
}

// Configuration Items
export interface Frame {
    id: string;
    shopId: string;
    name: string;
    price: number;
    description?: string;
}

export interface Size {
    id: string;
    shopId: string;
    name: string; // e.g., "A4", "24x36"
    modifier: number; // Price multiplier (e.g., 1.5)
    width?: number;
    height?: number;
    unit?: 'in' | 'cm';
}

export interface Material {
    id: string;
    shopId: string;
    name: string;
    markup: number; // Price multiplier (e.g., 1.2)
    description?: string;
}

// Pricing Matrix
export interface PriceMatrix {
    serviceId: string;
    sizeModifiers: Record<string, number>; // { "A4": 1.0, "A3": 1.5 }
    materialMarkups: Record<string, number>; // { "matte": 1.0, "glossy": 1.2 }
    mediumMarkups: Record<string, number>; // { "paper": 1.0, "metal": 2.0 }
    framePrices: Record<string, number>; // { "classic": 500, "modern": 800 }
    quantityDiscounts: Array<{
        minQuantity: number;
        discount: number; // 0.1 = 10% discount
    }>;
    rushOrderFee: number;
}

// Price Calculation Request/Response
export interface PriceCalculationRequest {
    size: string;
    material: string;
    medium: string;
    frame?: string;
    quantity: number;
    rushOrder: boolean;
}

export interface PriceCalculationResponse {
    basePrice: number;
    sizeModifier: number;
    materialMarkup: number;
    mediumMarkup: number;
    framePrice: number;
    quantityDiscount: number;
    rushOrderFee: number;
    totalPrice: number;
    breakdown: {
        label: string;
        value: number;
    }[];
}
