import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ArtistManagementConsole from "./pages/ArtistManagementConsole";
import PrintShop from "./pages/PrintShop";

import Artists from "./pages/Artists";
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/artist-console" element={<ArtistManagementConsole />} />
          <Route path="/print-shop" element={<PrintShop />} />
          {/* Add other routes as needed */}
        </Routes>
        <Toaster />
      </Router>
    </CartProvider>
  );
}

export default App;
