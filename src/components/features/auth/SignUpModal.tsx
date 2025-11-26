import React, { useState, useEffect } from "react";
import { auth, googleProvider } from "../../../lib/firebase";
import { signInWithPopup, signInWithCustomToken } from "firebase/auth";
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
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const res = await fetch(`${API_BASE}/sessionLogin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token: idToken }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Google signup failed");
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const handleEmailSignup = async (name: string, email: string, password: string, confirmPassword: string) => {
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }
      
      console.log("📝 Signup with:", { name, email });
      // Create user on backend which returns a Firebase custom token
      const res = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, userType: "buyer" }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Signup failed");
      }
      const data = await res.json();
      const customToken = data.token;
      if (!customToken) throw new Error("Missing custom token from signup");

      // Sign in with custom token to get an ID token, then create server session
      const cred = await signInWithCustomToken(auth, customToken);
      const idToken = await cred.user.getIdToken();

      const sess = await fetch(`${API_BASE}/sessionLogin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token: idToken }),
      });
      if (!sess.ok) {
        const txt = await sess.text();
        throw new Error(txt || "Failed to create session");
      }
      onClose();
    } catch (err: any) {
      console.error(err);
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

