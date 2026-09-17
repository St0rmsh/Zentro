export type NotificationType = "LIKE" | "COMMENT" | "FOLLOW" | "BOOKMARK" | "POST" | "MENTION" | "SYSTEM" | "MESSAGE" | "REPLY" | "ACHIEVEMENT" | "BADGE";

export interface NotificationActor {
  id: string;
  username: string;
  avatar?: string;
  fullname?: string;
}

export interface NotificationPostPreview {
  _id: string;
  title?: string;
  coverImage?: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  actor?: NotificationActor;
  post?: NotificationPostPreview;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  totalNotifications: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
