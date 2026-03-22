import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

interface AuthUser {
  id: string;
  profilePic?: string;
  fullName: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  onlineUsers: string[];
  socket: any;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsCheckingAuth: () => Promise<void>;
  signup: (data: unknown) => Promise<void>;
  login: (data: unknown) => Promise<void>;
  logout: () => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export const checkAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isCheckingAuth: true,
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  onlineUsers: [],
  socket: null,

  setIsAuthenticated: (isAuthenticated: boolean) =>
    set(() => ({ isAuthenticated })),

  setIsCheckingAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/checkAuth");
      set({ authUser: res.data, isAuthenticated: true });
      get().connectSocket();
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
      get().connectSocket();
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
      get().connectSocket();
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
      get().disconnectSocket();
    } catch (error) {
      console.log("Error in logout:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      set({ isLoggingOut: false });
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    console.log("connectSocket called, authUser:", authUser);

    if (!authUser || get().socket?.connected) return;

    const userId = authUser.id;
    console.log("authUser.id:", userId);

    if (!userId) {
      console.error("authUser.id is undefined, cannot connect socket");
      console.log("Full authUser object:", JSON.stringify(authUser, null, 2));
      return;
    }

    console.log("Connecting socket with userId:", userId);
    const socket = io("http://localhost:3000", {
      query: { userId },
    });
    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (userIds: string[]) => {
      console.log("Received online users:", userIds);
      set({ onlineUsers: userIds });
    });

  },
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
