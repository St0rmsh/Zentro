import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { likeService } from "../services/like.service";
import { loginThunk, hydrateAuthThunk } from "../../auth/state/authThunks";

const STORAGE_KEY = "zentro_liked_posts";

function loadLikedPosts(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLikedPosts(likedPosts: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(likedPosts));
  } catch {
    // Ignore storage failures
  }
}

export interface LikeState {
  /**
   * IDs of posts liked by the current user.
   */
  likedPosts: string[];

  /**
   * Shared like counts by post ID.
   *
   * This allows Feed, Trending, Recommended, For You,
   * Post Detail, etc. to display the same count.
   */
  likeCounts: Record<string, number>;

  /**
   * Per-post loading state.
   */
  loading: Record<string, boolean>;
}

const initialState: LikeState = {
  likedPosts: loadLikedPosts(),
  likeCounts: {},
  loading: {},
};

export const toggleLikeThunk = createAsyncThunk<
  {
    postId: string;
    liked: boolean;
    message: string;
    success: boolean;
  },
  string,
  { rejectValue: string }
>("likes/toggleLike", async (postId, { rejectWithValue }) => {
  try {
    const data = await likeService.toggleLike(postId);

    return {
      postId,
      liked: data.data?.liked ?? false,
      message: data.message,
      success: data.success,
    };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to toggle like"
    );
  }
});

const likeSlice = createSlice({
  name: "likes",
  initialState,

  reducers: {
    /**
     * Hydrate liked post IDs.
     */
    setLikedPosts: (state, action: PayloadAction<string[]>) => {
      state.likedPosts = action.payload;

      saveLikedPosts(state.likedPosts);
    },

    /**
     * Optimistically add a like.
     */
    addLike: (state, action: PayloadAction<string>) => {
      if (!state.likedPosts.includes(action.payload)) {
        state.likedPosts.push(action.payload);

        saveLikedPosts(state.likedPosts);
      }
    },

    /**
     * Optimistically remove a like.
     */
    removeLike: (state, action: PayloadAction<string>) => {
      state.likedPosts = state.likedPosts.filter(
        (id) => id !== action.payload
      );

      saveLikedPosts(state.likedPosts);
    },

    /**
     * Set the initial/server like count for a post.
     *
     * This should normally be dispatched when a post is loaded.
     */
    setLikeCount: (
      state,
      action: PayloadAction<{
        postId: string;
        count: number;
      }>
    ) => {
      const { postId, count } = action.payload;

      state.likeCounts[postId] = Math.max(0, count);
    },

    /**
     * Optimistically update the shared like count.
     *
     * Every component reading this post's count will immediately
     * receive the new value.
     */
    updateLikeCount: (
      state,
      action: PayloadAction<{
        postId: string;
        delta: number;
      }>
    ) => {
      const { postId, delta } = action.payload;

      const currentCount = state.likeCounts[postId] ?? 0;

      state.likeCounts[postId] = Math.max(
        0,
        currentCount + delta
      );
    },

    /**
     * Set an exact like count.
     *
     * Useful when the backend returns the authoritative count.
     */
    setLikeCountExact: (
      state,
      action: PayloadAction<{
        postId: string;
        count: number;
      }>
    ) => {
      state.likeCounts[action.payload.postId] = Math.max(
        0,
        action.payload.count
      );
    },

    /**
     * Clear all shared like counts.
     *
     * Useful during logout/account switching.
     */
    clearLikeCounts: (state) => {
      state.likeCounts = {};
    },
  },

  extraReducers: (builder) => {
    builder

      // --------------------------------------------------
      // Toggle Like - Pending
      // --------------------------------------------------
      .addCase(toggleLikeThunk.pending, (state, action) => {
        state.loading[action.meta.arg] = true;
      })

      // --------------------------------------------------
      // Toggle Like - Success
      // --------------------------------------------------
      .addCase(toggleLikeThunk.fulfilled, (state, action) => {
        const { postId, liked } = action.payload;

        state.loading[postId] = false;

        if (liked) {
          if (!state.likedPosts.includes(postId)) {
            state.likedPosts.push(postId);
          }
        } else {
          state.likedPosts = state.likedPosts.filter(
            (id) => id !== postId
          );
        }

        saveLikedPosts(state.likedPosts);
      })

      // --------------------------------------------------
      // Toggle Like - Failure
      // --------------------------------------------------
      .addCase(toggleLikeThunk.rejected, (state, action) => {
        const postId = action.meta.arg;

        state.loading[postId] = false;

        // Rollback is intentionally handled by LikeButton
        // because it knows the optimistic direction.
      })

      // --------------------------------------------------
      // Login
      // --------------------------------------------------
      .addCase(loginThunk.fulfilled, (state, action) => {
        if (action.payload.user?.likedPosts) {
          state.likedPosts = action.payload.user.likedPosts;

          saveLikedPosts(state.likedPosts);
        }
      })

      // --------------------------------------------------
      // Auth Hydration
      // --------------------------------------------------
      .addCase(hydrateAuthThunk.fulfilled, (state, action) => {
        if (action.payload?.likedPosts) {
          state.likedPosts = action.payload.likedPosts;

          saveLikedPosts(state.likedPosts);
        }
      });
  },
});

export const {
  setLikedPosts,
  addLike,
  removeLike,
  setLikeCount,
  updateLikeCount,
  setLikeCountExact,
  clearLikeCounts,
} = likeSlice.actions;

export default likeSlice.reducer;
