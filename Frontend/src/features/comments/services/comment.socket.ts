/**
 * Comment Socket Service — Architecture Preparation Only
 *
 * This module defines the event constants and placeholder handlers
 * for future real-time comment updates via Socket.IO.
 *
 * DO NOT connect or listen to these events yet.
 * Real-time will be implemented in a later phase.
 */

import { COMMENT_SOCKET_EVENTS, Comment } from "../types/comment.types";

// ---------- Event payload types ----------

export interface CommentNewPayload {
  postId: string;
  comment: Comment;
}

export interface CommentUpdatePayload {
  postId: string;
  comment: Comment;
}

export interface CommentDeletePayload {
  postId: string;
  commentId: string;
}

// ---------- Placeholder handler types ----------

export type CommentSocketHandlers = {
  [COMMENT_SOCKET_EVENTS.NEW]: (payload: CommentNewPayload) => void;
  [COMMENT_SOCKET_EVENTS.UPDATE]: (payload: CommentUpdatePayload) => void;
  [COMMENT_SOCKET_EVENTS.DELETE]: (payload: CommentDeletePayload) => void;
};

/**
 * Future: call this from a useEffect to register socket listeners.
 *
 * Example (NOT active yet):
 * ```ts
 * useEffect(() => {
 *   const cleanup = registerCommentSocketListeners(socket, dispatch);
 *   return cleanup;
 * }, [socket, dispatch]);
 * ```
 */
export function createCommentSocketHandlers(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _dispatch: unknown,
): CommentSocketHandlers {
  return {
    [COMMENT_SOCKET_EVENTS.NEW]: (_payload) => {
      // Future: dispatch(addRealtimeComment(payload))
    },
    [COMMENT_SOCKET_EVENTS.UPDATE]: (_payload) => {
      // Future: dispatch(updateRealtimeComment(payload))
    },
    [COMMENT_SOCKET_EVENTS.DELETE]: (_payload) => {
      // Future: dispatch(removeRealtimeComment(payload))
    },
  };
}
