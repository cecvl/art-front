import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { auth } from '../lib/firebase';
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
    onAuthStateChanged
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
    roles?: string[];  // User roles: ['buyer', 'artist', 'printShop']
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
    signupWithEmail: (email: string, password: string, displayName: string, userType: string) => Promise<void>;
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

    // Convert Firebase User to our User interface with roles from Firestore
    const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
        try {
            // Fetch user document from Firestore to get roles
            const { getFirestore, doc, getDoc } = await import('firebase/firestore');
            const db = getFirestore();
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            const userData = userDoc.data();

            return {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                roles: userData?.roles || [],
            };
        } catch (error) {
            console.error('Failed to fetch user roles:', error);
            // Return user without roles if fetch fails
            return {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                roles: [],
            };
        }
    };

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
                        roles: data.user.roles || [],
                    };
                }
            }
            return null;
        } catch (err) {
            console.error('Session validation failed:', err);
            return null;
        }
    };

    // Listen to Firebase auth state changes and sync with backend session
    useEffect(() => {
        setLoading(true);

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in with Firebase
                try {
                    // First, try to validate existing backend session
                    const sessionUser = await validateSession();

                    if (sessionUser) {
                        // Backend session is valid, use it
                        setUser(sessionUser);
                    } else {
                        // Backend session expired or doesn't exist, create new one
                        console.log('Creating new backend session...');
                        const idToken = await firebaseUser.getIdToken();
                        await createSession(idToken);
                        const userWithRoles = await convertFirebaseUser(firebaseUser);
                        setUser(userWithRoles);
                    }
                } catch (error) {
                    console.error('Session sync failed:', error);
                    // If session creation fails, still set user from Firebase
                    const userWithRoles = await convertFirebaseUser(firebaseUser);
                    setUser(userWithRoles);
                }
            } else {
                // User is signed out
                setUser(null);
            }
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
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
            const userWithRoles = await convertFirebaseUser(credential.user);
            setUser(userWithRoles);
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
            const userWithRoles = await convertFirebaseUser(result.user);
            setUser(userWithRoles);
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
        displayName: string,
        userType: string
    ): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            // Call backend signup endpoint
            // Backend will create Firebase user AND Firestore document with roles
            const signupResponse = await fetch(`${API_BASE}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    userType
                }),
            });

            if (!signupResponse.ok) {
                const errorText = await signupResponse.text();
                throw new Error(errorText || 'Backend signup failed');
            }

            // Backend returns a custom token
            const { token: customToken } = await signupResponse.json();

            // Sign in with the custom token from backend
            const { signInWithCustomToken } = await import('firebase/auth');
            const credential = await signInWithCustomToken(auth, customToken);

            // Update display name in Firebase
            await updateProfile(credential.user, { displayName });

            // IMPORTANT: Also set userType in Firestore for backend compatibility
            // Backend artwork upload checks for userType field, not just roles array
            const { getFirestore, doc, updateDoc } = await import('firebase/firestore');
            const db = getFirestore();
            await updateDoc(doc(db, 'users', credential.user.uid), {
                userType: userType,
                name: displayName
            });

            // Get ID token for session
            const idToken = await credential.user.getIdToken();

            // Create backend session
            await createSession(idToken);

            // Set user state
            setUser({
                uid: credential.user.uid,
                email: credential.user.email,
                displayName: displayName,
                photoURL: credential.user.photoURL,
            });
        } catch (err: any) {
            console.error('Signup error:', err);

            let errorMessage = 'Signup failed. Please try again.';
            if (err.message?.includes('email-already-in-use') || err.message?.includes('User creation failed')) {
                errorMessage = 'An account with this email already exists.';
            } else if (err.message?.includes('Invalid user type')) {
                errorMessage = 'Invalid account type selected.';
            } else if (err.message?.includes('network')) {
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
