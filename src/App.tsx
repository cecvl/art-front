import { useState } from "react";
import HomePage from "./components/HomePage";
import ArtPrints from "./components/ArtPrints";
import Artists from "./components/Artists";
import ArtistDetail from "./components/ArtistDetail";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import { artItems } from "./components/artData";

export interface CartItem {
  id: number;
  title: string;
  material: string;
  size: string;
  frame: string;
  image?: string;
  price: number;
  qty: number;
}

function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "artprints" | "artists" | "artistDetail" | "productDetail" | "cart">("home");
  const [selectedArtistId, setSelectedArtistId] = useState<number>(0);
  const [selectedProductId, setSelectedProductId] = useState<number>(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [previousPage, setPreviousPage] = useState<"home" | "artprints" | "artists" | "artistDetail" | "productDetail" | "cart" | null>(null);

  // Cart management functions - order matters, define updateQuantity before addToCart
  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item => (item.id === id ? { ...item, qty } : item))
    );
  };

  const addToCart = (product: Omit<CartItem, "id" | "qty">) => {
    // Check if item with same title, material, size, and frame already exists
    const existingItem = cartItems.find(item => 
      item.title === product.title &&
      item.material === product.material &&
      item.size === product.size &&
      item.frame === product.frame
    );

    if (existingItem) {
      // If exists, just increase quantity
      updateQuantity(existingItem.id, existingItem.qty + 1);
    } else {
      // Otherwise, add new item
      const newItem: CartItem = {
        ...product,
        id: Date.now(), // Simple ID generation
        qty: 1,
      };
      setCartItems(prev => [...prev, newItem]);
    }
  };

  const isItemInCart = (artId: number): boolean => {
    const artItem = artItems.find(item => item.id === artId);
    if (!artItem) return false;
    
    // Check if any cart item matches this art item's image
    return cartItems.some(cartItem => cartItem.image === artItem.image);
  };

  const [selectedArtItem, setSelectedArtItem] = useState<number | null>(null);

  const handleCardClick = (artId: number) => {
    setPreviousPage(currentPage);
    setSelectedArtItem(artId);
    setCurrentPage("productDetail");
  };

  const handleCartClick = (artId: number) => {
    // Directly add to cart without navigating
    const artItem = artItems.find(item => item.id === artId);
    if (artItem) {
      const defaultProduct = {
        title: `${artItem.title} - Canvas Print`,
        material: 'Canvas',
        size: 'Large',
        frame: 'No Frame',
        image: artItem.image,
        price: 105, // Default price
      };
      addToCart(defaultProduct);
    }
  };

  const handleNavigateToCart = () => {
    setPreviousPage(currentPage);
    setCurrentPage("cart");
  };

  if (currentPage === "cart") {
    return (
      <Cart
        cartItems={cartItems}
        onStartShopping={() => setCurrentPage("home")}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onBack={() => {
          if (previousPage && previousPage !== "cart") {
            setCurrentPage(previousPage);
          } else {
            setCurrentPage("home");
          }
        }}
      />
    );
  }

  if (currentPage === "productDetail") {
    return (
      <ProductDetail
        artItemId={selectedArtItem}
        onAddToCart={addToCart}
        onNavigateToCart={() => setCurrentPage("cart")}
      />
    );
  }

  if (currentPage === "artprints") {
    return (
      <ArtPrints 
        onBack={() => setCurrentPage("home")}
        onNavigateToHome={() => setCurrentPage("home")}
        onNavigateToArtPrints={() => setCurrentPage("artprints")}
        onNavigateToArtists={() => setCurrentPage("artists")}
        onCardClick={handleCardClick}
        onCartClick={handleCartClick}
        onHeaderCartClick={handleNavigateToCart}
        cartItemCount={cartItems.reduce((sum, item) => sum + item.qty, 0)}
        isItemInCart={isItemInCart}
      />
    );
  }

  if (currentPage === "artistDetail") {
    return (
      <ArtistDetail 
        artistId={selectedArtistId}
        onNavigateToHome={() => setCurrentPage("home")}
        onNavigateToArtPrints={() => setCurrentPage("artprints")}
        onNavigateToArtists={() => setCurrentPage("artists")}
        onCardClick={handleCardClick}
        onCartClick={handleCartClick}
        onHeaderCartClick={handleNavigateToCart}
        cartItemCount={cartItems.reduce((sum, item) => sum + item.qty, 0)}
        isItemInCart={isItemInCart}
      />
    );
  }

  if (currentPage === "artists") {
    return (
      <Artists 
        onNavigateToHome={() => setCurrentPage("home")}
        onNavigateToArtPrints={() => setCurrentPage("artprints")}
        onArtistClick={(artistId) => {
          setSelectedArtistId(artistId);
          setCurrentPage("artistDetail");
        }}
        onHeaderCartClick={handleNavigateToCart}
        cartItemCount={cartItems.reduce((sum, item) => sum + item.qty, 0)}
      />
    );
  }

  return (
    <HomePage 
      currentPage="home" 
      onNavigateToArtPrints={() => setCurrentPage("artprints")}
      onNavigateToArtists={() => setCurrentPage("artists")}
      onCardClick={handleCardClick}
      onCartClick={handleCartClick}
      onHeaderCartClick={handleNavigateToCart}
      cartItemCount={cartItems.reduce((sum, item) => sum + item.qty, 0)}
      isItemInCart={isItemInCart}
    />
  );
}

export default App;
