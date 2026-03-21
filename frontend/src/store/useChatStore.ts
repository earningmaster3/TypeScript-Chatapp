import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";
interface User {
  id: string;
  fullName: string;
  email: string;
  profilePic?: string;
}

interface ChatStore {
  messages: any[];
  users: User[];
  selectedUser: User | null; // Changed from { id: string | number } | null to User | null
  isUserLoading: boolean;
  isMessageLoading: boolean;
  isSendingMessage: boolean;
  getUsers: () => Promise<void>;
  setSelectedUser: (selectedUser: User | null) => void;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (message: any) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,
  isSendingMessage: false,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data.users });
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages: async (userId: string) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/get/${userId}`);
      set({ messages: res.data.messages });
    } catch (error) {
      toast.error("Failed to fetch messages");
    } finally {
      set({ isMessageLoading: false });
    }
  },

  setSelectedUser: (selectedUser: User | null) => {
    set({ selectedUser });
  },

  sendMessage: async (message: any) => {
    const { selectedUser, messages } = get();
    set({ isSendingMessage: true });
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser?.id || ""}`,
        message,
      );
      set({ messages: [...messages, res.data.newMessage] });
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      set({ isSendingMessage: false });
    }
  },
}));
