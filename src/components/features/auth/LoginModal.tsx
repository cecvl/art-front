import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { LoginForm } from "@/components/ui/login-form";

// Modal Overlay Component with smooth transitions
const ModalOverlay: React.FC<{ open: boolean; onClose: () => void; children: React.ReactNode }> = ({ open, onClose, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      // Trigger animation on next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!shouldRender) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.12)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.2s ease-in-out",
        pointerEvents: isVisible ? "auto" : "none",
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          transform: isVisible ? "scale(1)" : "scale(0.95)",
          transition: "transform 0.2s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// LoginModal Component
const LoginModal: React.FC<{ open: boolean; onClose: () => void; onSignUpClick: () => void }> = ({ open, onClose, onSignUpClick }) => {
  const { loginWithEmail, loginWithGoogle, clearError } = useAuth();

  // Clear error when modal closes
  useEffect(() => {
    if (!open) {
      clearError();
    }
  }, [open, clearError]);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      // Error is already set in AuthContext
      console.error('Google login failed:', err);
      throw err;
    }
  };

  const handleEmailLogin = async (email: string, password: string) => {
    try {
      await loginWithEmail(email, password);
      onClose();
    } catch (err: any) {
      // Error is already set in AuthContext
      console.error('Email login failed:', err);
      throw err;
    }
  };

  return (
    <ModalOverlay open={open} onClose={onClose}>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm
            onSignUpClick={() => { onClose(); onSignUpClick(); }}
            onClose={onClose}
            onGoogleLogin={handleGoogleLogin}
            onEmailLogin={handleEmailLogin}
          />
        </div>
      </div>
    </ModalOverlay>
  );
};

export default LoginModal;
