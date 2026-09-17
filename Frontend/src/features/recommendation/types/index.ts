export interface RecommendedPost {
  id: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  category: string;
  readingTime: number;
  publishedAt: string;
  reason?: string; // e.g. "Because you liked...", "Trending"
}

export interface RecommendedUser {
  id: string;
  username: string;
  avatar?: string;
  bio: string;
  followers: number;
  mutualInterests?: string[];
}

export interface TrendingTag {
  id: string;
  name: string;
  usageCount: number;
}

export interface TrendingCategory {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface ReadingProgressData {
  postId: string;
  title: string;
  author: string;
  progressPercentage: number;
  lastReadAt: string;
  estimatedTimeLeft: number;
}
