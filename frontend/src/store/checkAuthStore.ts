import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

interface AuthUser {
  id: number;
  profilePic: string;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsCheckingAuth: () => Promise<void>;
  signup: (data: unknown) => Promise<void>;
  login: (data: unknown) => Promise<void>;
  logout: (data: unknown) => Promise<void>;
}

export const checkAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isCheckingAuth: true,
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,

  setIsAuthenticated: (isAuthenticated: boolean) =>
    set(() => ({ isAuthenticated })),

  setIsCheckingAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/checkAuth");
      set({ authUser: res.data, isAuthenticated: true });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ isAuthenticated: false, authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: unknown) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data, isAuthenticated: true });
      toast.success("Account created successfully");
    } catch (error: unknown) {
      console.log("Error in signup:", error);
      let errorMsg = "Signup failed. Please try again.";
      if (error instanceof Error) {
        const axiosError = error as {
          response?: { data?: { error?: string } };
        };
        if (axiosError.response?.data?.error) {
          errorMsg = axiosError.response.data.error;
        }
      }
      toast.error(errorMsg);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data: unknown) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data, isAuthenticated: true });
      toast.success("Logged in successfully");
    } catch (error: unknown) {
      console.log("Error in login:", error);
      let errorMsg = "Login failed. Please try again.";
      if (error instanceof Error) {
        const axiosError = error as {
          response?: { data?: { error?: string } };
        };
        if (axiosError.response?.data?.error) {
          errorMsg = axiosError.response.data.error;
        }
      }
      toast.error(errorMsg);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null, isAuthenticated: false });
      toast.success("You are logged out");
    } catch (error) {
      console.log("Error in logout:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      set({ isLoggingOut: false });
    }
  },
}));
