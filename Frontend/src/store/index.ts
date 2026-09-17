import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/state/authSlice";
import userReducer from "./slices/userSlice";
import notificationReducer from "@/features/notification/state/notificationSlice";
import searchReducer from "@/features/search/state/searchSlice";
import themeReducer from "./slices/themeSlice";
import uiReducer from "./slices/uiSlice";
import socketReducer from "./slices/socketSlice";
import loadingReducer from "./slices/loadingSlice";
import feedReducer from "@/features/feed/state/feedSlice";
import commentReducer from "../features/comments/state/commentSlice";
import postReducer from "@/features/post/state/postSlice";
import postEditorReducer from "@/features/post-editor/state/postEditorSlice";

import likeReducer from "@/features/likes/state/likeSlice";
import bookmarkReducer from "@/features/bookmarks/state/bookmarkSlice";
import followReducer from "@/features/follow/state/followSlice";
import settingsReducer from "@/features/settings/state/settingsSlice";
import adminUsersReducer from "@/features/admin/state/adminUsersSlice";
import adminPostsReducer from "@/features/admin/state/adminPostsSlice";
import adminCommentsReducer from "@/features/admin/state/adminCommentsSlice";
import adminReportsReducer from "@/features/admin/state/adminReportsSlice";
import adminCategoriesReducer from "@/features/admin/state/adminCategoriesSlice";
import adminTagsReducer from "@/features/admin/state/adminTagsSlice";
import adminAnalyticsReducer from "@/features/admin/state/adminAnalyticsSlice";
import recommendationReducer from "@/features/recommendation/state/recommendationSlice";
import readingReducer from "@/features/reading/state/readingSlice";
import pwaReducer from "@/pwa/pwaSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    notification: notificationReducer,
    search: searchReducer,
    theme: themeReducer,
    ui: uiReducer,
    socket: socketReducer,
    loading: loadingReducer,
    feed: feedReducer,
    comments: commentReducer,
    post: postReducer,
    postEditor: postEditorReducer,
    likes: likeReducer,
    bookmarks: bookmarkReducer,
    follow: followReducer,
    settings: settingsReducer,
    adminUsers: adminUsersReducer,
    adminPosts: adminPostsReducer,
    adminComments: adminCommentsReducer,
    adminReports: adminReportsReducer,
    adminCategories: adminCategoriesReducer,
    adminTags: adminTagsReducer,
    adminAnalytics: adminAnalyticsReducer,
    recommendation: recommendationReducer,
    reading: readingReducer,
    pwa: pwaReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
