import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecommendedPost, RecommendedUser, TrendingTag, TrendingCategory, ReadingProgressData } from '../types';

interface RecommendationState {
  feed: RecommendedPost[];
  trendingPosts: RecommendedPost[];
  recommendedUsers: RecommendedUser[];
  trendingTags: TrendingTag[];
  trendingCategories: TrendingCategory[];
  continueReading: ReadingProgressData[];
  becauseYouLiked: RecommendedPost[];
  isLoading: boolean;
  error: string | null;
}

const initialState: RecommendationState = {
  feed: [],
  trendingPosts: [],
  recommendedUsers: [],
  trendingTags: [],
  trendingCategories: [],
  continueReading: [],
  becauseYouLiked: [],
  isLoading: false,
  error: null,
};

const recommendationSlice = createSlice({
  name: 'recommendation',
  initialState,
  reducers: {
    fetchRecommendationsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchFeedSuccess: (state, action: PayloadAction<RecommendedPost[]>) => {
      state.feed = action.payload;
      state.isLoading = false;
    },
    fetchTrendingSuccess: (state, action: PayloadAction<{ posts: RecommendedPost[], tags: TrendingTag[], categories: TrendingCategory[] }>) => {
      state.trendingPosts = action.payload.posts;
      state.trendingTags = action.payload.tags;
      state.trendingCategories = action.payload.categories;
      state.isLoading = false;
    },
    fetchUsersSuccess: (state, action: PayloadAction<RecommendedUser[]>) => {
      state.recommendedUsers = action.payload;
      state.isLoading = false;
    },
    updateContinueReading: (state, action: PayloadAction<ReadingProgressData[]>) => {
      state.continueReading = action.payload;
    },
    fetchFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { 
  fetchRecommendationsStart, 
  fetchFeedSuccess, 
  fetchTrendingSuccess, 
  fetchUsersSuccess, 
  updateContinueReading,
  fetchFailure 
} = recommendationSlice.actions;

export default recommendationSlice.reducer;
