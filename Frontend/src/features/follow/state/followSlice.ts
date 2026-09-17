import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { followService, FollowUser } from "../services/follow.service";

interface FollowState {
  followers: FollowUser[];
  following: FollowUser[];
  loading: boolean;
  loadingUserIds: string[];
  error: string | null;
  followerCount: number;
  followingCount: number;
  relationshipByUser: Record<string, { isFollowing: boolean; loading: boolean }>;
  hasMoreFollowers: boolean;
  hasMoreFollowing: boolean;
}

const initialState: FollowState = {
  followers: [],
  following: [],
  loading: false,
  loadingUserIds: [],
  error: null,
  followerCount: 0,
  followingCount: 0,
  relationshipByUser: {},
  hasMoreFollowers: false,
  hasMoreFollowing: false,
};

export const fetchFollowersThunk = createAsyncThunk(
  "follow/fetchFollowers",
  async ({ userId, page = 1, limit = 10 }: { userId: string; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      return await followService.getFollowers(userId, page, limit);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch followers");
    }
  }
);

export const fetchFollowingThunk = createAsyncThunk(
  "follow/fetchFollowing",
  async ({ userId, page = 1, limit = 10 }: { userId: string; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      return await followService.getFollowing(userId, page, limit);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch following");
    }
  }
);

export const fetchFollowStatusThunk = createAsyncThunk(
  "follow/fetchStatus",
  async (userId: string, { rejectWithValue }) => {
    try {
      return await followService.getFollowStatus(userId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch follow status");
    }
  }
);

export const toggleFollowThunk = createAsyncThunk(
  "follow/toggle",
  async ({ userId, isFollowing }: { userId: string; isFollowing: boolean }, { rejectWithValue }) => {
    try {
      if (isFollowing) {
        await followService.unfollowUser(userId);
        return { userId, isFollowing: false };
      }
      await followService.followUser(userId);
      return { userId, isFollowing: true };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update follow state");
    }
  }
);

const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {
    clearFollowError: (state) => {
      state.error = null;
    },
    setRelationshipStatus: (state, action: PayloadAction<{ userId: string; isFollowing: boolean }>) => {
      state.relationshipByUser[action.payload.userId] = {
        isFollowing: action.payload.isFollowing,
        loading: false,
      };
    },
    setFollowerCount: (state, action: PayloadAction<number>) => {
      state.followerCount = action.payload;
    },
    setFollowingCount: (state, action: PayloadAction<number>) => {
      state.followingCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.followers = action.payload.users;
        state.followerCount = action.payload.count;
        state.hasMoreFollowers = action.payload.users.length === 10;
      })
      .addCase(fetchFollowersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFollowingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowingThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.following = action.payload.users;
        state.followingCount = action.payload.count;
        state.hasMoreFollowing = action.payload.users.length === 10;
      })
      .addCase(fetchFollowingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFollowStatusThunk.fulfilled, (state, action) => {
        state.relationshipByUser[action.meta.arg] = {
          isFollowing: action.payload.isFollowing,
          loading: false,
        };
      })
      .addCase(toggleFollowThunk.pending, (state, action) => {
        const userId = action.meta.arg.userId;
        state.loadingUserIds = [...new Set([...state.loadingUserIds, userId])];
        state.relationshipByUser[userId] = {
          isFollowing: action.meta.arg.isFollowing,
          loading: true,
        };
      })
      .addCase(toggleFollowThunk.fulfilled, (state, action) => {
        const { userId, isFollowing } = action.payload;
        state.relationshipByUser[userId] = {
          isFollowing,
          loading: false,
        };
        state.followerCount = Math.max(0, state.followerCount + (isFollowing ? 1 : -1));
      })
      .addCase(toggleFollowThunk.rejected, (state, action) => {
        const userId = action.meta.arg.userId;
        state.loadingUserIds = state.loadingUserIds.filter((id) => id !== userId);
        state.relationshipByUser[userId] = {
          isFollowing: !action.meta.arg.isFollowing,
          loading: false,
        };
        state.error = action.payload as string;
      });
  },
});

export const { clearFollowError, setRelationshipStatus, setFollowerCount, setFollowingCount } = followSlice.actions;
export default followSlice.reducer;
