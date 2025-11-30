// Print Shop Type Definitions

// Location information
export interface Location {
    address: string;
    city: string;
    state: string;
    country: string;
}

// Contact information
export interface ContactInfo {
    email: string;
    phone: string;
    website?: string;
}

// Shop Profile
export interface PrintShop {
    id: string;
    ownerId: string;
    name: string;
    description?: string;
    location: Location;
    contact: ContactInfo;
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
    technology: string; // Changed from technologyType to match backend
    basePrice: number;
    priceMatrix: PriceMatrix;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
}

// Quantity discount tier
export interface QuantityTier {
    minQuantity: number;
    maxQuantity: number;
    discount: number; // e.g., 0.1 = 10% discount
}

// Complete Price Matrix structure
export interface PriceMatrix {
    sizeModifiers: Record<string, number>;
    quantityTiers: QuantityTier[];
    materialMarkups: Record<string, number>;
    mediumMarkups: Record<string, number>;
    framePrices: Record<string, number>;
    rushOrderFee: number;
}

// Configuration Items
export interface Frame {
    id: string;
    shopId: string;
    type: string; // classic, modern, premium, minimalist
    material: string; // wood, metal, acrylic, composite
    name: string;
    description?: string;
    price: number;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface Size {
    id: string;
    shopId: string;
    name: string; // e.g., "A4", "24x36"
    widthCM: number;
    heightCM: number;
    widthInch?: number;
    heightInch?: number;
    multiplier: number; // Price multiplier (e.g., 1.5)
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface Material {
    id: string;
    shopId: string;
    type: string; // matte, glossy, canvas, metal, paper, premium
    name: string;
    description?: string;
    markup: number; // Price multiplier (e.g., 1.2)
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
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
