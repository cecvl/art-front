import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleProtectedRoute from "./components/auth/RoleProtectedRoute";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ArtistManagementConsole from "./pages/ArtistManagementConsole";
import PrintShop from "./pages/PrintShop";
import Artists from "./pages/Artists";
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Route - Homepage (Onboarding) */}
            <Route path="/" element={<Home />} />

            {/* Protected Routes - Require Authentication */}
            <Route
              path="/artists"
              element={
                <ProtectedRoute>
                  <Artists />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/artist-console"
              element={
                <RoleProtectedRoute allowedRoles={['artist']}>
                  <ArtistManagementConsole />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/print-shop"
              element={
                <RoleProtectedRoute allowedRoles={['printShop']}>
                  <PrintShop />
                </RoleProtectedRoute>
              }
            />
          </Routes>
          <Toaster />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
