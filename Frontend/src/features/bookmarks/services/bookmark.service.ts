import { axiosInstance } from "@/shared/lib/axios";

export interface Bookmark {
  _id: string;
  post: any; // Ideally typed to Post
  user: string;
  createdAt: string;
  updatedAt: string;
}

interface ToggleBookmarkResponse {
  message: string;
  success: boolean;
  bookmark?: {
    message: string;
    bookmarked: boolean;
  };
}

interface GetBookmarksResponse {
  success: boolean;
  message?: string;
  bookmarks: Bookmark[];
  currentPage?: number;
  totalPages?: number;
  totalBookmarks?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalBookmarks: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const bookmarkService = {
  /**
   * Toggle bookmark on a post.
   * POST /api/bookmark/:postId
   */
  toggleBookmark: async (postId: string): Promise<ToggleBookmarkResponse> => {
    const response = await axiosInstance.post<ToggleBookmarkResponse>(
      `/bookmark/${postId}`
    );
    return response.data;
  },

  /**
   * Get my bookmarks.
   * GET /api/bookmark
   */
  getMyBookmarks: async (
    page = 1,
    limit = 10
  ): Promise<GetBookmarksResponse> => {
    const response = await axiosInstance.get<GetBookmarksResponse>(`/bookmark`, {
      params: { page, limit },
    });
    return response.data;
  },
};
