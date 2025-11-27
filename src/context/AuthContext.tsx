import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { auth } from '../lib/firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { googleProvider } from '../lib/firebase';

// API Base URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

// User interface
export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

// Auth state interface
interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

// Auth context interface
interface AuthContextType extends AuthState {
    loginWithEmail: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    signupWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
}

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
    children: ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Convert Firebase User to our User interface
    const convertFirebaseUser = (firebaseUser: FirebaseUser): User => ({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
    });

    // Create session cookie on backend
    const createSession = async (idToken: string): Promise<void> => {
        const response = await fetch(`${API_BASE}/sessionLogin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ token: idToken }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to create session');
        }
    };

    // Validate existing session on app load
    const validateSession = async (): Promise<User | null> => {
        try {
            const response = await fetch(`${API_BASE}/getprofile`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                // Backend returns { user: {...}, artworks: [...] }
                if (data.user && data.user.uid) {
                    return {
                        uid: data.user.uid,
                        email: data.user.email || null,
                        displayName: data.user.displayName || data.user.name || null,
                        photoURL: data.user.photoURL || null,
                    };
                }
            }
            return null;
        } catch (err) {
            console.error('Session validation failed:', err);
            return null;
        }
    };

    // Check for existing session on mount
    useEffect(() => {
        const initAuth = async () => {
            setLoading(true);
            const sessionUser = await validateSession();
            if (sessionUser) {
                setUser(sessionUser);
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    // Login with email and password
    const loginWithEmail = async (email: string, password: string): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            // Sign in with Firebase
            const credential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await credential.user.getIdToken();

            // Create backend session
            await createSession(idToken);

            // Set user state
            setUser(convertFirebaseUser(credential.user));
        } catch (err: any) {
            console.error('Login error:', err);

            // User-friendly error messages
            let errorMessage = 'Login failed. Please try again.';
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
                errorMessage = 'Invalid email or password.';
            } else if (err.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email.';
            } else if (err.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed attempts. Please try again later.';
            } else if (err.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your connection.';
            }

            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Login with Google
    const loginWithGoogle = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            // Sign in with Google popup
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();

            // Create backend session
            await createSession(idToken);

            // Set user state
            setUser(convertFirebaseUser(result.user));
        } catch (err: any) {
            console.error('Google login error:', err);

            let errorMessage = 'Google login failed. Please try again.';
            if (err.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Login cancelled.';
            } else if (err.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your connection.';
            }

            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Sign up with email and password
    const signupWithEmail = async (
        email: string,
        password: string,
        displayName: string
    ): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            // Create Firebase user
            const credential = await createUserWithEmailAndPassword(auth, email, password);

            // Update display name
            await updateProfile(credential.user, { displayName });

            // Get ID token
            const idToken = await credential.user.getIdToken();

            // Create backend session
            await createSession(idToken);

            // Set user state with updated display name
            setUser({
                uid: credential.user.uid,
                email: credential.user.email,
                displayName: displayName,
                photoURL: credential.user.photoURL,
            });
        } catch (err: any) {
            console.error('Signup error:', err);

            let errorMessage = 'Signup failed. Please try again.';
            if (err.code === 'auth/email-already-in-use') {
                errorMessage = 'An account with this email already exists.';
            } else if (err.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak. Use at least 6 characters.';
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (err.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your connection.';
            }

            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Logout
    const logout = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            // Sign out from Firebase
            await signOut(auth);

            // Clear backend session
            await fetch(`${API_BASE}/sessionLogout`, {
                method: 'POST',
                credentials: 'include',
            });

            // Clear user state
            setUser(null);
        } catch (err: any) {
            console.error('Logout error:', err);
            setError('Logout failed. Please try again.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Clear error
    const clearError = () => {
        setError(null);
    };

    const value: AuthContextType = {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        loginWithEmail,
        loginWithGoogle,
        signupWithEmail,
        logout,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
