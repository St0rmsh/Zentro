export interface CommentUser {
  _id: string;
  fullname: string;
  username: string;
  avatar?: string;
}

export interface Comment {
  _id: string;
  content: string;
  user: CommentUser;
  post: string;
  parentComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedComments {
  comments: Comment[];
  totalComments: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CreateCommentPayload {
  postId: string;
  content: string;
  parentComment?: string;
}

export interface UpdateCommentPayload {
  commentId: string;
  content: string;
}

/** Sort order for comments list */
export type SortOrder = "newest" | "oldest";

/** Comment state for Redux store */
export interface CommentState {
  commentsByPost: Record<string, PaginatedComments>;
  loading: boolean;
  creating: boolean;
  deletingId: string | null;
  editingId: string | null;
  updatingId: string | null;
  sortOrder: SortOrder;

  // Per-action error tracking
  fetchError: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
}

/**
 * Socket event constants — architecture preparation only.
 * Do NOT connect or listen to these yet.
 */
export const COMMENT_SOCKET_EVENTS = {
  NEW: "comment:new",
  UPDATE: "comment:update",
  DELETE: "comment:delete",
} as const;

export type CommentSocketEvent =
  (typeof COMMENT_SOCKET_EVENTS)[keyof typeof COMMENT_SOCKET_EVENTS];
