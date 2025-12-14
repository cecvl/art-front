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
import ArtistProfile from "./pages/ArtistProfile";
import Orders from "./pages/Orders";
import PaymentStatus from "./pages/PaymentStatus";
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
              path="/artist/:id"
              element={
                <ProtectedRoute>
                  <ArtistProfile />
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
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-status/:paymentId"
              element={
                <ProtectedRoute>
                  <PaymentStatus />
                </ProtectedRoute>
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
