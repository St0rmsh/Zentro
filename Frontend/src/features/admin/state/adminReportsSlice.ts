import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminReport } from '../types';

interface AdminReportsState {
  reports: AdminReport[];
  isLoading: boolean;
  error: string | null;
  total: number;
}

const initialState: AdminReportsState = {
  reports: [],
  isLoading: false,
  error: null,
  total: 0,
};

const adminReportsSlice = createSlice({
  name: 'adminReports',
  initialState,
  reducers: {
    fetchReportsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchReportsSuccess: (state, action: PayloadAction<{ reports: AdminReport[]; total: number }>) => {
      state.isLoading = false;
      state.reports = action.payload.reports;
      state.total = action.payload.total;
    },
    fetchReportsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateReportStatus: (state, action: PayloadAction<{ id: string; status: AdminReport['status'] }>) => {
      const report = state.reports.find((r) => r.id === action.payload.id);
      if (report) {
        report.status = action.payload.status;
      }
    },
  },
});

export const { fetchReportsStart, fetchReportsSuccess, fetchReportsFailure, updateReportStatus } = adminReportsSlice.actions;
export default adminReportsSlice.reducer;
