import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { create } from "zustand";
import api from "../services/api";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  socket: Socket | null;
  unreadCount: number;
  initSocket: (userId: string) => void;
  disconnectSocket: () => void;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  socket: null,
  unreadCount: 0,

  fetchNotifications: async () => {
    try {
      const response = await api.get("/notifications");
      const notifications = response.data;
      const unreadCount = notifications.filter((n: any) => !n.isRead).length;
      set({ notifications, unreadCount });
    } catch (error) {
      console.error(error);
    }
  },

  initSocket: (userId: string) => {
    if (get().socket) return;

    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

    const socket = io(socketUrl, {
      path: "/socket.io",
      transports: ["websocket"],
      autoConnect: true,
    });

    socket.on("connect", () => {
      socket.emit("registerUser", userId);
    });

    socket.on("newNotification", (notification: Notification) => {
      toast.info(`${notification.title}: ${notification.message}`, {
        duration: 5000,
      });

      set((state) => ({
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      }));
    });

    socket.on("connect_error", (error) => {
      console.error(error.message);
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  markAsRead: async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);

      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n,
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      console.error(error);
    }
  },
}));
