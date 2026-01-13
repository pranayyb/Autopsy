import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await authAPI.getCurrentUser();
            setUser(response.data.data.user);
        } catch (error) {
            localStorage.removeItem("accessToken");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password });
            const { user, accessToken } = response.data.data;
            localStorage.setItem("accessToken", accessToken);
            setUser(user);
            toast.success("Logged in successfully!");
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || "Login failed";
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            toast.success(
                "Registration successful! Please check your email to verify your account.",
            );
            return { success: true, data: response.data };
        } catch (error) {
            const message =
                error.response?.data?.message || "Registration failed";
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("accessToken");
            setUser(null);
            toast.success("Logged out successfully");
        }
    };

    const forgotPassword = async (email) => {
        try {
            await authAPI.forgotPassword(email);
            toast.success("Password reset email sent!");
            return { success: true };
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to send reset email";
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const resetPassword = async (token, newPassword) => {
        try {
            await authAPI.resetPassword(token, newPassword);
            toast.success("Password reset successfully!");
            return { success: true };
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to reset password";
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const changePassword = async (oldPassword, newPassword) => {
        try {
            await authAPI.changePassword(oldPassword, newPassword);
            toast.success("Password changed successfully!");
            return { success: true };
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to change password";
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const resendVerificationEmail = async () => {
        try {
            await authAPI.resendVerificationEmail();
            toast.success("Verification email sent! Please check your inbox.");
            return { success: true };
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Failed to send verification email";
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        changePassword,
        resendVerificationEmail,
        checkAuth,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export default AuthContext;
