import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ArtPrintLogo from '../../assets/PaaJuuPrints.svg';
import { Button } from "../ui/button";
import UserMenu from "./UserMenu";
import LoginModal from "../features/auth/LoginModal";
import SignUpModal from "../features/auth/SignUpModal";

// Cart Icon Component with notification badge
const CartIcon: React.FC<{
  onClick: () => void;
  itemCount: number;
}> = ({ onClick, itemCount }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="relative flex items-center gap-2"
      onClick={onClick}
      aria-label={`Cart (${itemCount} items)`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 17.9 19 19 19C20.1 19 21 18.1 21 17V13M9 19.5C9.8 19.5 10.5 20.2 10.5 21C10.5 21.8 9.8 22.5 9 22.5C8.2 22.5 7.5 21.8 7.5 21C7.5 20.2 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21C21.5 21.8 20.8 22.5 20 22.5C19.2 22.5 18.5 21.8 18.5 21C18.5 20.2 19.2 19.5 20 19.5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Button>
  );
};

// Header Component
const Header: React.FC<{
  onHomeClick?: () => void;
  onCartClick?: () => void;
  cartItemCount?: number;
  currentPage: "home" | "artists" | "printshop";
}> = ({ onHomeClick, onCartClick, cartItemCount = 0, currentPage }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleArtistsClick = () => {
    navigate('/artists');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2 sm:py-3 sm:px-4">
        {/* LOGO ON THE LEFT */}
        <div className="flex flex-none items-center">
          <img
            src={ArtPrintLogo}
            alt="PaaJuu Prints Logo"
            className="cursor-pointer transition-opacity hover:opacity-80"
            style={{ height: 'clamp(50px, 10vw, 80px)', width: 'auto' }}
            onClick={onHomeClick}
          />
        </div>

        {/* Desktop Navigation - Hidden on Mobile */}
        <nav className="hidden md:flex flex-1 justify-center gap-2 min-w-0">
          <Button
            variant={currentPage === "home" ? "secondary" : "ghost"}
            onClick={onHomeClick}
            className="text-xs font-semibold tracking-wide"
          >
            NEW ARRIVALS
          </Button>

          <Button
            variant={currentPage === "artists" ? "secondary" : "ghost"}
            onClick={handleArtistsClick}
            className="text-xs font-semibold tracking-wide"
          >
            ARTISTS
          </Button>

          <Button
            variant={currentPage === "printshop" ? "secondary" : "ghost"}
            onClick={() => navigate('/print-shop')}
            className="text-xs font-semibold tracking-wide"
          >
            PRINT SHOP
          </Button>
        </nav>

        {/* Right Side - Cart + Auth + Mobile Menu */}
        <div className="flex items-center justify-end gap-2">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-gray-200 rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <>
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </>
              ) : (
                <>
                  <path d="M3 12h18" />
                  <path d="M3 6h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>

          {/* Desktop Cart + Auth */}
          <div className="hidden sm:flex items-center gap-2">
            {onCartClick && <CartIcon onClick={onCartClick} itemCount={cartItemCount} />}

            {loading ? (
              // Loading skeleton
              <div className="h-9 w-24 animate-pulse rounded-md bg-gray-200" />
            ) : isAuthenticated && user ? (
              // Authenticated: Show User Menu
              <UserMenu user={user} onLogout={handleLogout} />
            ) : (
              // Not Authenticated: Show Login/Signup Buttons
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLoginModal(true)}
                >
                  Login
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setShowSignUpModal(true)}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Slide-out */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-semibold text-lg">Menu</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              <button
                onClick={() => { onHomeClick?.(); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${currentPage === 'home' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                NEW ARRIVALS
              </button>
              <button
                onClick={() => { handleArtistsClick(); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${currentPage === 'artists' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                ARTISTS
              </button>
              <button
                onClick={() => { navigate('/print-shop'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${currentPage === 'printshop' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                PRINT SHOP
              </button>

              {onCartClick && (
                <button
                  onClick={() => { onCartClick(); setMobileMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <span>Cart</span>
                  {cartItemCount > 0 && (
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              )}
            </div>

            {/* Mobile Auth Buttons */}
            {!loading && (
              <div className="mt-6 space-y-2">
                {isAuthenticated && user ? (
                  <>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Signed in as</p>
                      <p className="font-medium text-gray-900 truncate">{user.email}</p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => { setShowLoginModal(true); setMobileMenuOpen(false); }}
                    >
                      Login
                    </Button>
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={() => { setShowSignUpModal(true); setMobileMenuOpen(false); }}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSignUpClick={() => {
          setShowLoginModal(false);
          setShowSignUpModal(true);
        }}
      />

      {/* Sign Up Modal */}
      <SignUpModal
        open={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onLoginClick={() => {
          setShowSignUpModal(false);
          setShowLoginModal(true);
        }}
      />
    </>
  );
};

export default Header;
