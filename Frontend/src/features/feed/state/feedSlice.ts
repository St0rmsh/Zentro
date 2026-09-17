import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { feedService } from "../services/feed.service";
import { FeedState, FeedTab, Post } from "../types/feed.types";



export const fetchFeedThunk = createAsyncThunk(
  "feed/fetchFeed",
  async (page: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { feed: FeedState };
      const response = await feedService.getFeed(page, 10, state.feed.activeTab);
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }, message?: string };
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to load feed"
      );
    }
  }
);

export const refreshFeedThunk = createAsyncThunk(
  "feed/refreshFeed",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { feed: FeedState };
      const response = await feedService.getFeed(1, 10, state.feed.activeTab);
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }, message?: string };
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to refresh feed"
      );
    }
  }
);

const initialState: FeedState = {
  posts: [],
  loading: false,
  refreshing: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  hasNextPage: false,
  activeTab: "home",
  feedMode: "list",
  readingProgress: {},
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setTab: (state, action: PayloadAction<FeedTab>) => {
      state.activeTab = action.payload;
      state.posts = [];
      state.currentPage = 1;
      state.totalPages = 1;
      state.hasNextPage = false;
      state.error = null;
    },
    setFeedMode: (state, action: PayloadAction<"list" | "reels">) => {
      state.feedMode = action.payload;
    },
    updateReadingProgress: (
      state,
      action: PayloadAction<{ postId: string; progress: number }>
    ) => {
      const { postId, progress } = action.payload;
      state.readingProgress[postId] = Math.min(100, Math.max(0, Math.round(progress)));
    },
    updatePostLikesCount: (state, action: PayloadAction<{ postId: string; delta: number }>) => {
      const post = state.posts.find((item) => item._id === action.payload.postId);
      if (post) {
        post.likesCount = Math.max(0, post.likesCount + action.payload.delta);
      }
    },
    updatePostCommentsCount: (state, action: PayloadAction<{ postId: string; delta: number }>) => {
      const post = state.posts.find((item) => item._id === action.payload.postId);
      if (post) {
        post.commentsCount = Math.max(0, post.commentsCount + action.payload.delta);
      }
    },
    setPostCommentsCount: (state, action: PayloadAction<{ postId: string; count: number }>) => {
      const post = state.posts.find((item) => item._id === action.payload.postId);
      if (post) {
        post.commentsCount = Math.max(0, action.payload.count);
      }
    },
    clearFeedError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Feed
    builder.addCase(fetchFeedThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchFeedThunk.fulfilled, (state, action) => {
      state.loading = false;
      const newPosts = action.payload.posts;

      // Deduplicate posts
      if (state.currentPage === 1 || state.activeTab !== "home") {
        state.posts = newPosts;
      } else {
        const existingIds = new Set(state.posts.map((p) => p._id));
        const filteredNewPosts = newPosts.filter((p) => !existingIds.has(p._id));
        state.posts = [...state.posts, ...filteredNewPosts];
      }

      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.hasNextPage = action.payload.hasNextPage;
    });
    builder.addCase(fetchFeedThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Refresh Feed
    builder.addCase(refreshFeedThunk.pending, (state) => {
      state.refreshing = true;
      state.error = null;
    });
    builder.addCase(refreshFeedThunk.fulfilled, (state, action) => {
      state.refreshing = false;
      state.posts = action.payload.posts;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.hasNextPage = action.payload.hasNextPage;
    });
    builder.addCase(refreshFeedThunk.rejected, (state, action) => {
      state.refreshing = false;
      state.error = action.payload as string;
    });
  },
});

export const { setTab, setFeedMode, updateReadingProgress, updatePostLikesCount, updatePostCommentsCount, setPostCommentsCount, clearFeedError } = feedSlice.actions;
export default feedSlice.reducer;
