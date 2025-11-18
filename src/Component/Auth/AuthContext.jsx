import { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    updateEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider
} from 'firebase/auth';
import { auth } from '../Firebase/firbase.init';
import toast from 'react-hot-toast';

// Create context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    // Register with email and password
    const register = async (email, password, name, photoURL = '') => {
        try {
            setAuthError(null);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update profile with name and photo
            await updateProfile(userCredential.user, {
                displayName: name,
                photoURL: photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
            });

            // Refresh user to get updated profile
            await userCredential.user.reload();

            toast.success(`Welcome to Chill Gamer, ${name}! 🎮`);
            return { success: true, user: userCredential.user };
        } catch (error) {
            const errorMessage = getAuthErrorMessage(error.code);
            setAuthError(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    // Login with email and password
    const login = async (email, password) => {
        try {
            setAuthError(null);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            toast.success(`Welcome back, ${userCredential.user.displayName}! 👋`);
            return { success: true, user: userCredential.user };
        } catch (error) {
            const errorMessage = getAuthErrorMessage(error.code);
            setAuthError(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    // Google authentication
    const googleLogin = async () => {
        try {
            setAuthError(null);
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({
                prompt: 'select_account'
            });
            const userCredential = await signInWithPopup(auth, provider);
            toast.success(`Welcome, ${userCredential.user.displayName}! 🎮`);
            return { success: true, user: userCredential.user };
        } catch (error) {
            const errorMessage = getAuthErrorMessage(error.code);
            setAuthError(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    // GitHub authentication
    const githubLogin = async () => {
        try {
            setAuthError(null);
            const provider = new GithubAuthProvider();
            provider.setCustomParameters({
                allow_signup: 'true'
            });
            const userCredential = await signInWithPopup(auth, provider);
            toast.success(`Welcome, ${userCredential.user.displayName || 'Gamer'}! 🎮`);
            return { success: true, user: userCredential.user };
        } catch (error) {
            const errorMessage = getAuthErrorMessage(error.code);
            setAuthError(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    // Logout
    const logout = async () => {
        try {
            await signOut(auth);
            toast.success('See you soon! 👋');
            return { success: true };
        } catch (error) {
            const errorMessage = getAuthErrorMessage(error.code);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    // Password reset
    const resetPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success('Password reset email sent! 📧');
            return { success: true };
        } catch (error) {
            const errorMessage = getAuthErrorMessage(error.code);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    // Update user profile
    const updateUserProfile = async (updates) => {
        try {
            if (!user) throw new Error('No user logged in');

            if (updates.displayName || updates.photoURL) {
                await updateProfile(user, updates);
            }

            if (updates.email && updates.email !== user.email) {
                await updateEmail(user, updates.email);
            }

            // Refresh user data
            await user.reload();
            setUser({ ...user, ...updates });

            toast.success('Profile updated successfully! ✅');
            return { success: true };
        } catch (error) {
            const errorMessage = getAuthErrorMessage(error.code);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    // Update password
    const updateUserPassword = async (newPassword, currentPassword = null) => {
        try {
            if (!user) throw new Error('No user logged in');

            // If current password is provided, reauthenticate first
            if (currentPassword) {
                const credential = EmailAuthProvider.credential(user.email, currentPassword);
                await reauthenticateWithCredential(user, credential);
            }

            await updatePassword(user, newPassword);
            toast.success('Password updated successfully! ✅');
            return { success: true };
        } catch (error) {
            const errorMessage = getAuthErrorMessage(error.code);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    // Reauthenticate user (for sensitive operations)
    const reauthenticate = async (password) => {
        try {
            if (!user) throw new Error('No user logged in');

            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);
            return { success: true };
        } catch (error) {
            const errorMessage = getAuthErrorMessage(error.code);
            return { success: false, error: errorMessage };
        }
    };

    // Clear auth error
    const clearError = () => {
        setAuthError(null);
    };

    // Get user role (you can extend this for admin roles)
    const getUserRole = () => {
        if (!user) return 'guest';
        // You can add custom claims logic here for admin roles
        return 'user';
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return !!user;
    };

    // Auth state listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
            setAuthError(null);
        });

        return unsubscribe;
    }, []);

    // Helper function to get user-friendly error messages
    const getAuthErrorMessage = (errorCode) => {
        const errorMessages = {
            // Registration errors
            'auth/email-already-in-use': 'This email is already registered. Please try logging in.',
            'auth/invalid-email': 'Please enter a valid email address.',
            'auth/operation-not-allowed': 'Email/password accounts are not enabled. Please contact support.',
            'auth/weak-password': 'Password should be at least 6 characters with uppercase and lowercase letters.',

            // Login errors
            'auth/user-disabled': 'This account has been disabled. Please contact support.',
            'auth/user-not-found': 'No account found with this email. Please check your email or register.',
            'auth/wrong-password': 'Incorrect password. Please try again.',
            'auth/invalid-credential': 'Invalid login credentials. Please check your email and password.',

            // Social login errors
            'auth/popup-closed-by-user': 'Login cancelled. Please try again.',
            'auth/popup-blocked': 'Popup was blocked. Please allow popups for this site.',
            'auth/unauthorized-domain': 'This domain is not authorized for authentication.',

            // Password reset errors
            'auth/missing-email': 'Please enter your email address.',

            // General errors
            'auth/network-request-failed': 'Network error. Please check your connection and try again.',
            'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
            'auth/requires-recent-login': 'Please log in again to perform this action.',
        };

        return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
    };

    // Context value
    const value = {
        // State
        user,
        loading,
        authError,

        // Authentication methods
        register,
        login,
        logout,
        googleLogin,
        githubLogin,
        resetPassword,

        // Profile management
        updateUserProfile,
        updateUserPassword,
        reauthenticate,

        // Utility methods
        clearError,
        getUserRole,
        isAuthenticated,

        // User data shortcuts
        userId: user?.uid,
        userEmail: user?.email,
        userName: user?.displayName,
        userPhoto: user?.photoURL,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;