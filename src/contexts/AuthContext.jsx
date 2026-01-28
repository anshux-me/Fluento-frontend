/**
 * Authentication Context
 * Provides Firebase authentication state throughout the app
 */

import { createContext, useContext, useState, useEffect } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { syncUser } from '../services/api';

const AuthContext = createContext(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                // Sync user with backend
                try {
                    await syncUser(
                        firebaseUser.uid,
                        firebaseUser.email,
                        firebaseUser.displayName
                    );
                } catch (err) {
                    console.error('Error syncing user:', err);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Sign up with email/password
    const signUp = async (email, password, displayName) => {
        setError(null);
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);

            // Update display name
            if (displayName) {
                await updateProfile(result.user, { displayName });
            }

            // Sync with backend
            await syncUser(result.user.uid, email, displayName || email.split('@')[0]);

            return result.user;
        } catch (err) {
            setError(getErrorMessage(err.code));
            throw err;
        }
    };

    // Sign in with email/password
    const signIn = async (email, password) => {
        setError(null);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            return result.user;
        } catch (err) {
            setError(getErrorMessage(err.code));
            throw err;
        }
    };

    // Sign in with Google
    const signInWithGoogle = async () => {
        setError(null);
        try {
            const result = await signInWithPopup(auth, googleProvider);

            // Sync with backend
            await syncUser(
                result.user.uid,
                result.user.email,
                result.user.displayName
            );

            return result.user;
        } catch (err) {
            setError(getErrorMessage(err.code));
            throw err;
        }
    };

    // Sign out
    const logout = async () => {
        setError(null);
        try {
            await signOut(auth);
        } catch (err) {
            setError(getErrorMessage(err.code));
            throw err;
        }
    };

    // Clear error
    const clearError = () => setError(null);

    const value = {
        user,
        loading,
        error,
        signUp,
        signIn,
        signInWithGoogle,
        logout,
        clearError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Convert Firebase error codes to user-friendly messages
function getErrorMessage(code) {
    switch (code) {
        case 'auth/email-already-in-use':
            return 'This email is already registered. Try signing in instead.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/user-not-found':
            return 'No account found with this email.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please try again later.';
        case 'auth/popup-closed-by-user':
            return 'Sign-in popup was closed. Please try again.';
        default:
            return 'An error occurred. Please try again.';
    }
}

export default AuthContext;
