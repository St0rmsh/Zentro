import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminPost } from '../types';

interface AdminPostsState {
  posts: AdminPost[];
  isLoading: boolean;
  error: string | null;
  total: number;
}

const initialState: AdminPostsState = {
  posts: [],
  isLoading: false,
  error: null,
  total: 0,
};

const adminPostsSlice = createSlice({
  name: 'adminPosts',
  initialState,
  reducers: {
    fetchPostsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchPostsSuccess: (state, action: PayloadAction<{ posts: AdminPost[]; total: number }>) => {
      state.isLoading = false;
      state.posts = action.payload.posts;
      state.total = action.payload.total;
    },
    fetchPostsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    togglePostVisibility: (state, action: PayloadAction<{ id: string; isHidden: boolean }>) => {
      const post = state.posts.find((p) => p.id === action.payload.id);
      if (post) {
        post.isHidden = action.payload.isHidden;
      }
    },
    togglePostFeatured: (state, action: PayloadAction<{ id: string; isFeatured: boolean }>) => {
      const post = state.posts.find((p) => p.id === action.payload.id);
      if (post) {
        post.isFeatured = action.payload.isFeatured;
      }
    },
  },
});

export const { fetchPostsStart, fetchPostsSuccess, fetchPostsFailure, togglePostVisibility, togglePostFeatured } = adminPostsSlice.actions;
export default adminPostsSlice.reducer;
