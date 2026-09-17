/**
 * Post Detail Redux Slice
 * Manages state for single post reading experience
 * Uses Redux Toolkit + async thunks
 */

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { postService } from "../services/post.service";
import type { PostState, PostDetail, ReadingSettings } from "../types/post.types";

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEY_SETTINGS = "zentro_reading_settings";
const STORAGE_KEY_POSITION = "zentro_reading_positions";

const DEFAULT_SETTINGS: ReadingSettings = {
  fontSize: 18,
  readingWidth: "medium",
  focusMode: false,
};

// ============================================================================
// HELPERS
// ============================================================================

function loadSettings(): ReadingSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch {
    // Ignore parse errors
  }
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: ReadingSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch {
    // Ignore storage errors
  }
}

function loadReadingPosition(postId: string): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_POSITION);
    if (stored) {
      const positions = JSON.parse(stored);
      return positions[postId] ?? 0;
    }
  } catch {
    // Ignore
  }
  return 0;
}

function saveReadingPosition(postId: string, position: number): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_POSITION);
    const positions = stored ? JSON.parse(stored) : {};
    positions[postId] = position;

    // Keep only last 50 positions to avoid storage bloat
    const keys = Object.keys(positions);
    if (keys.length > 50) {
      const oldest = keys.slice(0, keys.length - 50);
      oldest.forEach((key) => delete positions[key]);
    }

    localStorage.setItem(STORAGE_KEY_POSITION, JSON.stringify(positions));
  } catch {
    // Ignore
  }
}

// ============================================================================
// ASYNC THUNKS
// ============================================================================

export const fetchPostThunk = createAsyncThunk(
  "post/fetchPost",
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await postService.getPostById(postId);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }, message?: string };
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to load post"
      );
    }
  }
);

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: PostState = {
  currentPost: null,
  loading: false,
  error: null,
  readingProgress: 0,
  readingPosition: 0,
  settings: loadSettings(),
};

// ============================================================================
// SLICE
// ============================================================================

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setReadingProgress: (state, action: PayloadAction<number>) => {
      state.readingProgress = Math.min(100, Math.max(0, Math.round(action.payload)));
    },

    setReadingPosition: (state, action: PayloadAction<number>) => {
      state.readingPosition = action.payload;
      if (state.currentPost) {
        saveReadingPosition(state.currentPost._id, action.payload);
      }
    },

    setFontSize: (state, action: PayloadAction<number>) => {
      const size = Math.min(24, Math.max(14, action.payload));
      state.settings.fontSize = size;
      saveSettings(state.settings);
    },

    setReadingWidth: (
      state,
      action: PayloadAction<"narrow" | "medium" | "wide">
    ) => {
      state.settings.readingWidth = action.payload;
      saveSettings(state.settings);
    },

    toggleFocusMode: (state) => {
      state.settings.focusMode = !state.settings.focusMode;
      saveSettings(state.settings);
    },

    clearPost: (state) => {
      state.currentPost = null;
      state.loading = false;
      state.error = null;
      state.readingProgress = 0;
      state.readingPosition = 0;
    },

    clearPostError: (state) => {
      state.error = null;
    },

    updatePostDetailLikesCount: (state, action: PayloadAction<number>) => {
      if (state.currentPost) {
        state.currentPost.likesCount = Math.max(0, state.currentPost.likesCount + action.payload);
      }
    },

    updatePostDetailCommentsCount: (state, action: PayloadAction<number>) => {
      if (state.currentPost) {
        state.currentPost.commentsCount = Math.max(0, state.currentPost.commentsCount + action.payload);
      }
    },

    setPostDetailCommentsCount: (state, action: PayloadAction<number>) => {
      if (state.currentPost) {
        state.currentPost.commentsCount = Math.max(0, action.payload);
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchPostThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      fetchPostThunk.fulfilled,
      (state, action: PayloadAction<PostDetail>) => {
        state.loading = false;
        state.currentPost = action.payload;
        // Restore reading position from localStorage
        state.readingPosition = loadReadingPosition(action.payload._id);
      }
    );

    builder.addCase(fetchPostThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  setReadingProgress,
  setReadingPosition,
  setFontSize,
  setReadingWidth,
  toggleFocusMode,
  clearPost,
  clearPostError,
  updatePostDetailLikesCount,
  updatePostDetailCommentsCount,
  setPostDetailCommentsCount,
} = postSlice.actions;

export default postSlice.reducer;
