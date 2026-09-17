import type { Post } from "@/features/feed/types/feed.types";
import type { User } from "@/shared/types/user.types";

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  limit: number;
  hasNextPage: boolean;
}

export interface Tag {
  name: string;
  count: number;
}

export interface SearchOverviewResponse {
  success: boolean;
  message: string;
  query: string;
  posts: Post[];
  users: User[];
  tags: Tag[];
  postPagination: PaginationData;
  userPagination: PaginationData;
}

export interface SearchPostsResponse {
  success: boolean;
  message: string;
  posts: Post[];
  currentPage: number;
  totalPages: number;
  limit: number;
  hasNextPage: boolean;
}

export interface SearchUsersResponse {
  success: boolean;
  message: string;
  users: User[];
  currentPage: number;
  totalPages: number;
  limit: number;
  hasNextPage: boolean;
}

export interface SearchTagsResponse {
  success: boolean;
  message: string;
  tags: Tag[];
}

export interface DiscoverResponse {
  success: boolean;
  message: string;
  trendingPosts: Post[];
  topUsers: User[];
  trendingTags: Tag[];
}
