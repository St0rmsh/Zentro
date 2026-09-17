import { axiosInstance } from "@/shared/lib/axios";
import { Comment, PaginatedComments } from "../types/comment.types";

/**
 * Comment API Service
 * All comment-related API calls are centralised here.
 * NO API logic should live inside components.
 *
 * Backend routes (mounted at /api/comment):
 *   POST   /post/:postId   → create comment    → { message, success, data: comment }
 *   GET    /post/:postId   → list comments      → { message, success, comments, totalComments, … }
 *   GET    /:commentId     → single comment      → { message, success, comment }
 *   PATCH  /:commentId     → update comment      → { message, success, comment }
 *   DELETE /:commentId     → delete comment      → { message, success, comment }
 */

// ---------- Response shapes (match backend controller) ----------

interface GetCommentsResponse {
  message: string;
  success: boolean;
  comments: Comment[];
  totalComments: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface CreateCommentResponse {
  message: string;
  success: boolean;
  data: {
    comment: Comment;
    commentsCount: number;
  };
}

interface DeleteCommentResponse {
  message: string;
  success: boolean;
  data: {
    comment: Comment;
    commentsCount: number;
  };
}

interface SingleCommentResponse {
  message: string;
  success: boolean;
  comment: Comment;
}

// ---------- Service ----------

export const commentService = {
  /**
   * Fetch paginated comments for a post.
   * GET /api/comment/post/:postId?page=&limit=
   */
  getComments: async (
    postId: string,
    page = 1,
    limit = 10,
  ): Promise<PaginatedComments> => {
    const response = await axiosInstance.get<GetCommentsResponse>(
      `/comment/post/${postId}`,
      { params: { page, limit } },
    );

    const d = response.data;
    return {
      comments: d.comments,
      totalComments: d.totalComments,
      totalPages: d.totalPages,
      currentPage: d.currentPage,
      limit: d.limit,
      hasNextPage: d.hasNextPage,
      hasPrevPage: d.hasPrevPage,
    };
  },

  /**
   * Create a new comment on a post.
   * POST /api/comment/post/:postId  body: { content }
   */
  createComment: async (postId: string, content: string): Promise<{ comment: Comment; commentsCount: number }> => {
    const response = await axiosInstance.post<CreateCommentResponse>(
      `/comment/post/${postId}`,
      { content },
    );
    return response.data.data;
  },

  /**
   * Fetch a single comment by ID.
   * GET /api/comment/:commentId
   */
  getComment: async (commentId: string): Promise<Comment> => {
    const response = await axiosInstance.get<SingleCommentResponse>(
      `/comment/${commentId}`,
    );
    return response.data.comment;
  },

  /**
   * Update a comment.
   * PATCH /api/comment/:commentId  body: { content }
   */
  updateComment: async (
    commentId: string,
    content: string,
  ): Promise<Comment> => {
    const response = await axiosInstance.patch<SingleCommentResponse>(
      `/comment/${commentId}`,
      { content },
    );
    return response.data.comment;
  },

  /**
   * Delete a comment.
   * DELETE /api/comment/:commentId
   */
  deleteComment: async (commentId: string): Promise<{ comment: Comment; commentsCount: number }> => {
    const response = await axiosInstance.delete<DeleteCommentResponse>(`/comment/${commentId}`);
    return response.data.data;
  },
};
