export interface FeedAuthor {
  _id: string;
  username: string;
  fullname: string;
  avatar?: string;
  isVerified?: boolean;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  coverImage?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video" | "none";
  category: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
  score?: number;
  user: FeedAuthor;
}

export interface FeedResponse {
  success: boolean;
  message: string;
  posts: Post[];
  totalPosts: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export type FeedTab = "home" | "trending" | "following" | "recommended";

export interface FeedState {
  posts: Post[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  activeTab: FeedTab;
  feedMode: "list" | "reels";
  readingProgress: Record<string, number>; // Maps postId to scroll progress (0 to 100)
}
