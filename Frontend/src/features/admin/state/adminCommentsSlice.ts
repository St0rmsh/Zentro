import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminComment } from '../types';

interface AdminCommentsState {
  comments: AdminComment[];
  isLoading: boolean;
  error: string | null;
  total: number;
}

const initialState: AdminCommentsState = {
  comments: [],
  isLoading: false,
  error: null,
  total: 0,
};

const adminCommentsSlice = createSlice({
  name: 'adminComments',
  initialState,
  reducers: {
    fetchCommentsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchCommentsSuccess: (state, action: PayloadAction<{ comments: AdminComment[]; total: number }>) => {
      state.isLoading = false;
      state.comments = action.payload.comments;
      state.total = action.payload.total;
    },
    fetchCommentsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateCommentStatus: (state, action: PayloadAction<{ id: string; status: AdminComment['status'] }>) => {
      const comment = state.comments.find((c) => c.id === action.payload.id);
      if (comment) {
        comment.status = action.payload.status;
      }
    },
  },
});

export const { fetchCommentsStart, fetchCommentsSuccess, fetchCommentsFailure, updateCommentStatus } = adminCommentsSlice.actions;
export default adminCommentsSlice.reducer;
