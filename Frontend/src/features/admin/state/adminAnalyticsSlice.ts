import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AnalyticsData {
  userGrowth: { name: string; users: number }[];
  postActivity: { name: string; posts: number }[];
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalReports: number;
}

interface AdminAnalyticsState {
  data: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminAnalyticsState = {
  data: null,
  isLoading: false,
  error: null,
};

const adminAnalyticsSlice = createSlice({
  name: 'adminAnalytics',
  initialState,
  reducers: {
    fetchAnalyticsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchAnalyticsSuccess: (state, action: PayloadAction<AnalyticsData>) => {
      state.isLoading = false;
      state.data = action.payload;
    },
    fetchAnalyticsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchAnalyticsStart, fetchAnalyticsSuccess, fetchAnalyticsFailure } = adminAnalyticsSlice.actions;
export default adminAnalyticsSlice.reducer;
