import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { SignupForm } from "@/components/ui/signup-form";

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

// Sign Up Modal Component
const SignUpModal: React.FC<{ open: boolean; onClose: () => void; onLoginClick: () => void }> = ({ open, onClose, onLoginClick }) => {
  const { signupWithEmail, loginWithGoogle, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Clear error when modal closes
  useEffect(() => {
    if (!open) {
      clearError();
    }
  }, [open, clearError]);

  const handleSignupSuccess = () => {
    // Get return URL from location state, default to homepage
    const returnUrl = (location.state as any)?.returnUrl || '/';
    onClose();
    navigate(returnUrl, { replace: true });
  };

  const handleGoogleSignUp = async () => {
    try {
      await loginWithGoogle();
      handleSignupSuccess();
    } catch (err: any) {
      // Error is already set in AuthContext
      console.error('Google signup failed:', err);
      throw err;
    }
  };

  const handleEmailSignup = async (name: string, email: string, password: string, confirmPassword: string, userType: string) => {
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      console.log("📝 Signup with:", { name, email, userType });

      // Use AuthContext signup method
      await signupWithEmail(email, password, name, userType);
      handleSignupSuccess();
    } catch (err: any) {
      console.error('Email signup failed:', err);
      throw err;
    }
  };

  return (
    <ModalOverlay open={open} onClose={onClose}>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignupForm
            onLoginClick={() => { onClose(); onLoginClick(); }}
            onClose={onClose}
            onGoogleSignup={handleGoogleSignUp}
            onEmailSignup={handleEmailSignup}
          />
        </div>
      </div>
    </ModalOverlay>
  );
};

export default SignUpModal;
