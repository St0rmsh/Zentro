import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminUser } from '../types';

interface AdminUsersState {
  users: AdminUser[];
  isLoading: boolean;
  error: string | null;
  total: number;
}

const initialState: AdminUsersState = {
  users: [],
  isLoading: false,
  error: null,
  total: 0,
};

const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    fetchUsersStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action: PayloadAction<{ users: AdminUser[]; total: number }>) => {
      state.isLoading = false;
      state.users = action.payload.users;
      state.total = action.payload.total;
    },
    fetchUsersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateUserStatus: (state, action: PayloadAction<{ id: string; status: AdminUser['status'] }>) => {
      const user = state.users.find((u) => u.id === action.payload.id);
      if (user) {
        user.status = action.payload.status;
      }
    },
    updateUserRole: (state, action: PayloadAction<{ id: string; role: AdminUser['role'] }>) => {
      const user = state.users.find((u) => u.id === action.payload.id);
      if (user) {
        user.role = action.payload.role;
      }
    },
  },
});

export const { fetchUsersStart, fetchUsersSuccess, fetchUsersFailure, updateUserStatus, updateUserRole } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;
