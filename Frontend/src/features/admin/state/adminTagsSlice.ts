import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminTag } from '../types';

interface AdminTagsState {
  tags: AdminTag[];
  isLoading: boolean;
  error: string | null;
  total: number;
}

const initialState: AdminTagsState = {
  tags: [],
  isLoading: false,
  error: null,
  total: 0,
};

const adminTagsSlice = createSlice({
  name: 'adminTags',
  initialState,
  reducers: {
    fetchTagsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchTagsSuccess: (state, action: PayloadAction<{ tags: AdminTag[]; total: number }>) => {
      state.isLoading = false;
      state.tags = action.payload.tags;
      state.total = action.payload.total;
    },
    fetchTagsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateTag: (state, action: PayloadAction<AdminTag>) => {
      const index = state.tags.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tags[index] = action.payload;
      }
    },
    deleteTag: (state, action: PayloadAction<string>) => {
      state.tags = state.tags.filter((t) => t.id !== action.payload);
      state.total -= 1;
    },
  },
});

export const { fetchTagsStart, fetchTagsSuccess, fetchTagsFailure, updateTag, deleteTag } = adminTagsSlice.actions;
export default adminTagsSlice.reducer;
