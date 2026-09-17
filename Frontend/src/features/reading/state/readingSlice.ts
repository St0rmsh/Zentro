import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReadingGoal, ReadingStreak, Achievement, ReadingHistoryItem, ReadingPreferences } from '../types';

interface ReadingState {
  goal: ReadingGoal;
  streak: ReadingStreak;
  achievements: Achievement[];
  history: ReadingHistoryItem[];
  preferences: ReadingPreferences;
  currentSession: {
    postId: string | null;
    scrollPercentage: number;
    estimatedTimeLeft: number;
    wordsRead: number;
  };
  isLoading: boolean;
}

const initialState: ReadingState = {
  goal: {
    dailyMinutes: 30,
    weeklyArticles: 5,
    currentDailyMinutes: 0,
    currentWeeklyArticles: 0,
    lastUpdated: new Date().toISOString(),
  },
  streak: {
    currentStreak: 0,
    longestStreak: 0,
    lastReadDate: '',
    weeklyActivity: [false, false, false, false, false, false, false],
  },
  achievements: [],
  history: [],
  preferences: {
    fontSize: 'medium',
    readingWidth: 'normal',
    lineHeight: 'normal',
    theme: 'system',
    focusMode: false,
  },
  currentSession: {
    postId: null,
    scrollPercentage: 0,
    estimatedTimeLeft: 0,
    wordsRead: 0,
  },
  isLoading: false,
};

const readingSlice = createSlice({
  name: 'reading',
  initialState,
  reducers: {
    setReadingData: (state, action: PayloadAction<{ goal: ReadingGoal, streak: ReadingStreak, achievements: Achievement[], history: ReadingHistoryItem[] }>) => {
      state.goal = action.payload.goal;
      state.streak = action.payload.streak;
      state.achievements = action.payload.achievements;
      state.history = action.payload.history;
    },
    updateCurrentSession: (state, action: PayloadAction<Partial<ReadingState['currentSession']>>) => {
      state.currentSession = { ...state.currentSession, ...action.payload };
    },
    toggleFocusMode: (state) => {
      state.preferences.focusMode = !state.preferences.focusMode;
    },
    updatePreferences: (state, action: PayloadAction<Partial<ReadingPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    addHistoryItem: (state, action: PayloadAction<ReadingHistoryItem>) => {
      const exists = state.history.findIndex(h => h.postId === action.payload.postId);
      if (exists !== -1) {
        state.history[exists] = action.payload;
      } else {
        state.history.unshift(action.payload);
      }
    }
  },
});

export const {
  setReadingData,
  updateCurrentSession,
  toggleFocusMode,
  updatePreferences,
  addHistoryItem
} = readingSlice.actions;

export default readingSlice.reducer;