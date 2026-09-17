import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminCategory } from '../types';

interface AdminCategoriesState {
  categories: AdminCategory[];
  isLoading: boolean;
  error: string | null;
  total: number;
}

const initialState: AdminCategoriesState = {
  categories: [],
  isLoading: false,
  error: null,
  total: 0,
};

const adminCategoriesSlice = createSlice({
  name: 'adminCategories',
  initialState,
  reducers: {
    fetchCategoriesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchCategoriesSuccess: (state, action: PayloadAction<{ categories: AdminCategory[]; total: number }>) => {
      state.isLoading = false;
      state.categories = action.payload.categories;
      state.total = action.payload.total;
    },
    fetchCategoriesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateCategory: (state, action: PayloadAction<AdminCategory>) => {
      const index = state.categories.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    addCategory: (state, action: PayloadAction<AdminCategory>) => {
      state.categories.push(action.payload);
      state.total += 1;
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter((c) => c.id !== action.payload);
      state.total -= 1;
    },
  },
});

export const { fetchCategoriesStart, fetchCategoriesSuccess, fetchCategoriesFailure, updateCategory, addCategory, deleteCategory } = adminCategoriesSlice.actions;
export default adminCategoriesSlice.reducer;
