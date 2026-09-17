/**
 * Post Detail Feature — Type Definitions
 * Defines the data structures for single post reading experience
 */

export interface PostAuthor {
  _id: string;
  username: string;
  fullname: string;
  avatar?: string;
  bio?: string;
  isVerified?: boolean;
}

export interface PostDetail {
  _id: string;
  title: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  user: PostAuthor;
  // Future-ready fields
  subtitle?: string;
}

export interface PostDetailResponse {
  success: boolean;
  message: string;
  data: PostDetail;
}

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export interface ReadingSettings {
  fontSize: number; // 14–24, default 18
  readingWidth: "narrow" | "medium" | "wide"; // default "medium"
  focusMode: boolean;
}

export interface PostState {
  currentPost: PostDetail | null;
  loading: boolean;
  error: string | null;
  readingProgress: number; // 0–100
  readingPosition: number; // scroll Y
  settings: ReadingSettings;
}
