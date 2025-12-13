import { createContext, useContext, useState, type ReactNode } from 'react';

export interface CartItem {
    id: number;
    artId?: number; // Original art item ID for tracking
    title: string;
    material: string;
    size: string;
    frame: string;
    image?: string;
    price: number;
    quantity: number; // Add quantity field
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Omit<CartItem, "id" | "quantity">) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, qty: number) => void;
    clearCart: () => void;
    isItemInCart: (artId: number) => boolean;
    cartItemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const removeFromCart = (id: number) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id);
            return;
        }
        setCartItems(prev =>
            prev.map(item => (item.id === id ? { ...item, quantity } : item))
        );
    };

    const addToCart = (product: Omit<CartItem, "id" | "quantity">) => {
        setCartItems(prev => {
            const existingItem = prev.find(item =>
                item.title === product.title &&
                item.material === product.material &&
                item.size === product.size &&
                item.frame === product.frame
            );

            if (existingItem) {
                return prev.map(item => (item.id === existingItem.id ? { ...item, quantity: item.quantity + 1 } : item));
            } else {
                const newItem: CartItem = {
                    ...product,
                    id: Date.now(),
                    quantity: 1,
                };
                return [...prev, newItem];
            }
        });
    };

    const isItemInCart = (artId: number): boolean => {
        return cartItems.some(cartItem => cartItem.artId === artId);
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, isItemInCart, cartItemCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
