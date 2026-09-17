export interface ReadingGoal {
  dailyMinutes: number;
  weeklyArticles: number;
  currentDailyMinutes: number;
  currentWeeklyArticles: number;
  lastUpdated: string;
}

export interface ReadingStreak {
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string;
  weeklyActivity: boolean[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface ReadingHistoryItem {
  postId: string;
  title: string;
  author: string;
  category: string;
  completionPercentage: number;
  readAt: string;
}

export interface ReadingPreferences {
  fontSize: 'small' | 'medium' | 'large';
  readingWidth: 'narrow' | 'normal' | 'wide';
  lineHeight: 'tight' | 'normal' | 'loose';
  theme: 'system' | 'light' | 'dark';
  focusMode: boolean;
}