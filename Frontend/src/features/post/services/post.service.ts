/**
 * Post Detail Service
 * Handles all API calls for single post operations
 * No API logic inside components — strict service layer separation
 */

import { axiosInstance } from "@/shared/lib/axios";
import type { PostDetailResponse } from "../types/post.types";

export const postService = {
  /**
   * Fetch a single post by ID
   * Backend: GET /api/post/:postId
   * Auto-increments viewsCount and populates user (fullname, username, avatar)
   */
  getPostById: async (postId: string): Promise<PostDetailResponse> => {
    const response = await axiosInstance.get<PostDetailResponse>(
      `/post/${postId}`
    );
    return response.data;
  },

  
};
