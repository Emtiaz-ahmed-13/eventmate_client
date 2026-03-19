"use client";

import { useEffect, useState } from "react";
import { getSocket, connectSocket, disconnectSocket } from "@/lib/socket";
import { toast } from "sonner";

export interface Notification {
  id: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export const useNotifications = (userId: string | undefined) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    connectSocket(userId);
    const socket = getSocket();

    socket.on("new-notification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      toast(notification.message, {
        description: new Date(notification.createdAt).toLocaleTimeString(),
      });
    });

    return () => {
      socket.off("new-notification");
      disconnectSocket();
    };
  }, [userId]);

  const markAllRead = () => setUnreadCount(0);

  return { notifications, unreadCount, markAllRead };
};
