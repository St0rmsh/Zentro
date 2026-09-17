import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Notification, NotificationListResponse } from "../types";
import { notificationService } from "../services/notification.service";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  loadingMore: false,
  error: null,
  page: 1,
  totalPages: 1,
  hasMore: false,
};

export const fetchNotificationsThunk = createAsyncThunk<
  NotificationListResponse,
  { page?: number; limit?: number },
  { rejectValue: string }
>("notification/fetchNotifications", async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
  try {
    return await notificationService.getNotifications(page, limit);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to load notifications");
  }
});

export const fetchUnreadCountThunk = createAsyncThunk<number, void, { rejectValue: string }>(
  "notification/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      return await notificationService.getUnreadCount();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to load unread count");
    }
  }
);

export const markAsReadThunk = createAsyncThunk<void, string, { rejectValue: string }>(
  "notification/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      await notificationService.markAsRead(notificationId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to mark notification as read");
    }
  }
);

export const markAllAsReadThunk = createAsyncThunk<void, void, { rejectValue: string }>(
  "notification/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      await notificationService.markAllAsRead();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to mark all notifications as read");
    }
  }
);

export const deleteNotificationThunk = createAsyncThunk<void, string, { rejectValue: string }>(
  "notification/deleteNotification",
  async (notificationId, { rejectWithValue }) => {
    try {
      await notificationService.deleteNotification(notificationId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete notification");
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      const exists = state.notifications.some((item) => item.id === action.payload.id);
      if (exists) return;
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    clearNotificationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationsThunk.pending, (state, action) => {
        state.error = null;
        if (action.meta.arg.page && action.meta.arg.page > 1) {
          state.loadingMore = true;
        } else {
          state.loading = true;
        }
      })
      .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        if (action.meta.arg.page && action.meta.arg.page > 1) {
          state.notifications = [...state.notifications, ...action.payload.notifications];
        } else {
          state.notifications = action.payload.notifications;
        }
        state.page = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.hasMore = action.payload.hasNextPage;
      })
      .addCase(fetchNotificationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload ?? "Unable to load notifications";
      })
      .addCase(fetchUnreadCountThunk.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(markAsReadThunk.fulfilled, (state, action) => {
        const notificationId = action.meta.arg;
        const item = state.notifications.find((entry) => entry.id === notificationId);
        if (item && !item.isRead) {
          item.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllAsReadThunk.fulfilled, (state) => {
        state.notifications.forEach((item) => {
          item.isRead = true;
        });
        state.unreadCount = 0;
      })
      .addCase(deleteNotificationThunk.fulfilled, (state, action) => {
        const notificationId = action.meta.arg;
        const item = state.notifications.find((entry) => entry.id === notificationId);
        if (item && !item.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications = state.notifications.filter((item) => item.id !== notificationId);
      });
  },
});

export const { addNotification, setUnreadCount, clearNotificationError } = notificationSlice.actions;
export default notificationSlice.reducer;
