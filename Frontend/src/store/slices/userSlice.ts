import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  email: string;
  username: string;
  fullname: string;
  avatar?: string;
  bio?: string;
  role: "user" | "admin" | "moderator";
  isVerified: boolean;
  followerCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  users: Record<string, User>; // Cache of fetched users
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
  users: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.users[action.payload.id] = action.payload;
    },

    updateCurrentUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload,
        };
        state.users[state.currentUser.id] = state.currentUser;
      }
    },

    setUsers: (state, action: PayloadAction<User[]>) => {
      action.payload.forEach((user) => {
        state.users[user.id] = user;
      });
    },

    setCachedUser: (state, action: PayloadAction<User>) => {
      state.users[action.payload.id] = action.payload;
    },

    clearCurrentUser: (state) => {
      state.currentUser = null;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    clearUsersCache: (state) => {
      state.users = {};
    },
  },
});

export const {
  setCurrentUser,
  updateCurrentUser,
  setUsers,
  setCachedUser,
  clearCurrentUser,
  setLoading,
  setError,
  clearUsersCache,
} = userSlice.actions;

export default userSlice.reducer;
