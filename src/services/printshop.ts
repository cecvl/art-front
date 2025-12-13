import type {
    PrintShop,
    PrintService,
    Frame,
    Size,
    Material,
    PriceMatrix,
    PriceCalculationRequest,
    PriceCalculationResponse,
} from '../types/printshop';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// ============================================
// Helper Functions for Data Transformation
// ============================================

// Form data interface for easier form handling
export interface ShopProfileFormData {
    name: string;
    description?: string;
    address: string;
    city: string;
    state: string;
    country: string;
    email: string;
    phone: string;
    website?: string;
    isActive: boolean;
}

// Transform flat form data to nested backend structure
const transformFormToBackend = (formData: ShopProfileFormData): Omit<PrintShop, 'id' | 'ownerId' | 'createdAt' | 'rating'> => {
    return {
        name: formData.name,
        description: formData.description || '',
        location: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
        },
        contact: {
            email: formData.email,
            phone: formData.phone,
            website: formData.website || '',
        },
        isActive: formData.isActive,
    };
};

// Transform nested backend data to flat form structure
export const transformBackendToForm = (shop: PrintShop): ShopProfileFormData => {
    return {
        name: shop.name,
        description: shop.description || '',
        address: shop.location.address,
        city: shop.location.city,
        state: shop.location.state,
        country: shop.location.country,
        email: shop.contact.email,
        phone: shop.contact.phone,
        website: shop.contact.website || '',
        isActive: shop.isActive,
    };
};

// ============================================
// Shop Profile APIs
// ============================================

export const getShopProfile = async (): Promise<PrintShop> => {
    const res = await fetch(`${API_BASE}/printshop/profile`, {
        credentials: 'include',
    });

    if (!res.ok) {
        if (res.status === 404) {
            throw new Error('SHOP_NOT_FOUND');
        }
        throw new Error('Failed to fetch shop profile');
    }

    return res.json();
};

export const createShopProfile = async (
    formData: ShopProfileFormData
): Promise<PrintShop> => {
    const backendData = transformFormToBackend(formData);

    const res = await fetch(`${API_BASE}/printshop/profile/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(backendData),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to create shop profile');
    }

    return res.json();
};

export const updateShopProfile = async (formData: ShopProfileFormData): Promise<PrintShop> => {
    const backendData = transformFormToBackend(formData);

    const res = await fetch(`${API_BASE}/printshop/profile/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(backendData),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to update shop profile');
    }

    return res.json();
};

// ============================================
// Service APIs
// ============================================

export const getServices = async (): Promise<PrintService[]> => {
    const res = await fetch(`${API_BASE}/printshop/services`, {
        credentials: 'include',
    });

    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
};

export const createService = async (
    data: Omit<PrintService, 'id' | 'shopId' | 'createdAt'>
): Promise<PrintService> => {
    const res = await fetch(`${API_BASE}/printshop/services/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to create service');
    }

    return res.json();
};

export const updateService = async (
    id: string,
    data: Partial<PrintService>
): Promise<PrintService> => {
    const res = await fetch(`${API_BASE}/printshop/services/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to update service');
    }

    return res.json();
};

export const deleteService = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/printshop/services/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to delete service');
    }
};

// ============================================
// Frame APIs
// ============================================

export const getFrames = async (): Promise<Frame[]> => {
    const res = await fetch(`${API_BASE}/printshop/frames`, {
        credentials: 'include',
    });

    if (!res.ok) throw new Error('Failed to fetch frames');
    return res.json();
};

export const createFrame = async (data: Omit<Frame, 'id' | 'shopId'>): Promise<Frame> => {
    const res = await fetch(`${API_BASE}/printshop/frames/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to create frame');
    }

    return res.json();
};

export const updateFrame = async (id: string, data: Partial<Frame>): Promise<Frame> => {
    const res = await fetch(`${API_BASE}/printshop/frames/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to update frame');
    }

    return res.json();
};

export const deleteFrame = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/printshop/frames/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to delete frame');
    }
};

// ============================================
// Size APIs
// ============================================

export const getSizes = async (): Promise<Size[]> => {
    const res = await fetch(`${API_BASE}/printshop/sizes`, {
        credentials: 'include',
    });

    if (!res.ok) throw new Error('Failed to fetch sizes');
    return res.json();
};

export const createSize = async (data: Omit<Size, 'id' | 'shopId'>): Promise<Size> => {
    const res = await fetch(`${API_BASE}/printshop/sizes/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to create size');
    }

    return res.json();
};

export const updateSize = async (id: string, data: Partial<Size>): Promise<Size> => {
    const res = await fetch(`${API_BASE}/printshop/sizes/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to update size');
    }

    return res.json();
};

export const deleteSize = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/printshop/sizes/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to delete size');
    }
};

// ============================================
// Material APIs
// ============================================

export const getMaterials = async (): Promise<Material[]> => {
    const res = await fetch(`${API_BASE}/printshop/materials`, {
        credentials: 'include',
    });

    if (!res.ok) throw new Error('Failed to fetch materials');
    return res.json();
};

export const createMaterial = async (
    data: Omit<Material, 'id' | 'shopId'>
): Promise<Material> => {
    const res = await fetch(`${API_BASE}/printshop/materials/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to create material');
    }

    return res.json();
};

export const updateMaterial = async (
    id: string,
    data: Partial<Material>
): Promise<Material> => {
    const res = await fetch(`${API_BASE}/printshop/materials/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to update material');
    }

    return res.json();
};

export const deleteMaterial = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/printshop/materials/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to delete material');
    }
};

// ============================================
// Pricing APIs
// ============================================

export const getServicePricing = async (serviceId: string): Promise<PriceMatrix> => {
    const res = await fetch(`${API_BASE}/printshop/services/pricing/${serviceId}`, {
        credentials: 'include',
    });

    if (!res.ok) throw new Error('Failed to fetch pricing');
    return res.json();
};

export const updateServicePricing = async (
    serviceId: string,
    data: PriceMatrix
): Promise<PriceMatrix> => {
    const res = await fetch(`${API_BASE}/printshop/services/pricing/update/${serviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to update pricing');
    }

    return res.json();
};

export const calculateServicePrice = async (
    serviceId: string,
    options: PriceCalculationRequest
): Promise<PriceCalculationResponse> => {
    const res = await fetch(`${API_BASE}/printshop/services/calculate/${serviceId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(options),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to calculate price');
    }

    return res.json();
};
