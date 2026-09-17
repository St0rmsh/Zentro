import { axiosInstance } from "@/shared/lib/axios";
import type { Notification, NotificationListResponse, NotificationType } from "../types";

const normalizeNotificationType = (type?: string): NotificationType => {
  switch (type) {
    case "LIKE":
      return "LIKE";
    case "COMMENT":
      return "COMMENT";
    case "FOLLOW":
      return "FOLLOW";
    case "BOOKMARK":
      return "BOOKMARK";
    case "POST":
      return "POST";
    case "MENTION":
      return "MENTION";
    case "MESSAGE":
      return "MESSAGE";
    case "REPLY":
      return "REPLY";
    case "ACHIEVEMENT":
      return "ACHIEVEMENT";
    case "BADGE":
      return "BADGE";
    default:
      return "SYSTEM";
  }
};

export const normalizeNotification = (raw: any): Notification => {
  const actor = raw.sender
    ? {
        id: raw.sender._id || raw.sender.id,
        username: raw.sender.username || "user",
        avatar: raw.sender.avatar,
        fullname: raw.sender.fullname,
      }
    : undefined;

  const title = raw.type === "LIKE"
    ? "New like"
    : raw.type === "COMMENT"
      ? "New comment"
      : raw.type === "FOLLOW"
        ? "New follower"
        : raw.type === "BOOKMARK"
          ? "Post bookmarked"
          : "Notification";

  return {
    id: raw._id || raw.id,
    type: normalizeNotificationType(raw.type),
    title,
    message: raw.message || "You have a new notification",
    actor,
    post: raw.post
      ? {
          _id: raw.post._id || raw.post.id,
          title: raw.post.title,
          coverImage: raw.post.coverImage,
        }
      : undefined,
    isRead: Boolean(raw.isRead),
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || raw.createdAt || new Date().toISOString(),
  };
};

export const notificationService = {
  getNotifications: async (page = 1, limit = 10): Promise<NotificationListResponse> => {
    const response = await axiosInstance.get(`/notification`, { params: { page, limit } });
    const payload = response.data;
    return {
      notifications: (payload.notifications || []).map(normalizeNotification),
      totalNotifications: payload.totalNotifications || 0,
      totalPages: payload.totalPages || 1,
      currentPage: payload.currentPage || page,
      limit: payload.limit || limit,
      hasNextPage: Boolean(payload.hasNextPage),
      hasPrevPage: Boolean(payload.hasPrevPage),
    };
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await axiosInstance.get(`/notification/unread-count`);
    return response.data?.unreadCount ?? 0;
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await axiosInstance.patch(`/notification/${notificationId}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await axiosInstance.patch(`/notification/read-all`);
  },

  deleteNotification: async (notificationId: string): Promise<void> => {
    await axiosInstance.delete(`/notification/${notificationId}`);
  },
};
