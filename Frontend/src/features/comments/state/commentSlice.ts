import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { commentService } from "../services/comment.service";
import {
  CommentState,
  Comment,
  PaginatedComments,
  SortOrder,
} from "../types/comment.types";

// ─── Initial State ────────────────────────────────────────────────────────

const initialState: CommentState = {
  commentsByPost: {},
  loading: false,
  creating: false,
  deletingId: null,
  editingId: null,
  updatingId: null,
  sortOrder: "newest",

  fetchError: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

// ─── Thunks ───────────────────────────────────────────────────────────────

export const fetchCommentsThunk = createAsyncThunk<
  { postId: string; data: PaginatedComments },
  { postId: string; page?: number; limit?: number },
  { rejectValue: string }
>("comments/fetchComments", async ({ postId, page, limit }, { rejectWithValue }) => {
  try {
    const data = await commentService.getComments(postId, page, limit);
    return { postId, data };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch comments",
    );
  }
});

export const createCommentThunk = createAsyncThunk<
  { postId: string; comment: Comment; commentsCount: number },
  { postId: string; content: string },
  { rejectValue: string }
>("comments/createComment", async ({ postId, content }, { rejectWithValue }) => {
  try {
    const result = await commentService.createComment(postId, content);
    return { postId, comment: result.comment, commentsCount: result.commentsCount };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create comment",
    );
  }
});

export const updateCommentThunk = createAsyncThunk<
  { postId: string; comment: Comment },
  { postId: string; commentId: string; content: string },
  { rejectValue: string }
>(
  "comments/updateComment",
  async ({ postId, commentId, content }, { rejectWithValue }) => {
    try {
      const comment = await commentService.updateComment(commentId, content);
      return { postId, comment };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update comment",
      );
    }
  },
);

export const deleteCommentThunk = createAsyncThunk<
  { postId: string; commentId: string; commentsCount: number },
  { postId: string; commentId: string },
  { rejectValue: string }
>("comments/deleteComment", async ({ postId, commentId }, { rejectWithValue }) => {
  try {
    const result = await commentService.deleteComment(commentId);
    return { postId, commentId, commentsCount: result.commentsCount };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete comment",
    );
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    /** Set the ID of the comment currently being edited inline */
    setEditingId(state, action: PayloadAction<string | null>) {
      state.editingId = action.payload;
    },
    /** Clear the editing state */
    clearEditingId(state) {
      state.editingId = null;
    },
    /** Toggle between newest-first and oldest-first */
    setSortOrder(state, action: PayloadAction<SortOrder>) {
      state.sortOrder = action.payload;
    },
    /** Clear all comments (e.g. on unmount) */
    clearComments(state, action: PayloadAction<string | undefined>) {
      if (action.payload) {
        delete state.commentsByPost[action.payload];
      } else {
        state.commentsByPost = {};
      }
    },
    /** Clear specific error */
    clearCommentError(
      state,
      action: PayloadAction<"fetch" | "create" | "update" | "delete">,
    ) {
      switch (action.payload) {
        case "fetch":
          state.fetchError = null;
          break;
        case "create":
          state.createError = null;
          break;
        case "update":
          state.updateError = null;
          break;
        case "delete":
          state.deleteError = null;
          break;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ─── Fetch Comments ────────────────────────────────────────
      .addCase(fetchCommentsThunk.pending, (state) => {
        state.loading = true;
        state.fetchError = null;
      })
      .addCase(fetchCommentsThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, data } = action.payload;

        // If it's page 1, replace. Otherwise append.
        if (data.currentPage === 1 || !state.commentsByPost[postId]) {
          state.commentsByPost[postId] = data;
        } else {
          // Append comments — avoid duplicates
          const existing = state.commentsByPost[postId];
          const newComments = data.comments.filter(
            (nc) => !existing.comments.some((c) => c._id === nc._id),
          );

          state.commentsByPost[postId] = {
            ...data,
            comments: [...existing.comments, ...newComments],
          };
        }
      })
      .addCase(fetchCommentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.fetchError = action.payload ?? "Failed to fetch comments";
      })

      // ─── Create Comment ────────────────────────────────────────
      .addCase(createCommentThunk.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createCommentThunk.fulfilled, (state, action) => {
        state.creating = false;
        const { postId, comment } = action.payload;

        if (state.commentsByPost[postId]) {
          state.commentsByPost[postId].comments.unshift(comment);
          state.commentsByPost[postId].totalComments += 1;
        } else {
          state.commentsByPost[postId] = {
            comments: [comment],
            totalComments: 1,
            totalPages: 1,
            currentPage: 1,
            limit: 10,
            hasNextPage: false,
            hasPrevPage: false,
          };
        }
      })
      .addCase(createCommentThunk.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload ?? "Failed to create comment";
      })

      // ─── Update Comment ────────────────────────────────────────
      .addCase(updateCommentThunk.pending, (state, action) => {
        state.updatingId = action.meta.arg.commentId;
        state.updateError = null;
      })
      .addCase(updateCommentThunk.fulfilled, (state, action) => {
        state.updatingId = null;
        state.editingId = null;
        const { postId, comment } = action.payload;

        if (state.commentsByPost[postId]) {
          const idx = state.commentsByPost[postId].comments.findIndex(
            (c) => c._id === comment._id,
          );
          if (idx !== -1) {
            state.commentsByPost[postId].comments[idx] = comment;
          }
        }
      })
      .addCase(updateCommentThunk.rejected, (state, action) => {
        state.updatingId = null;
        state.updateError = action.payload ?? "Failed to update comment";
      })

      // ─── Delete Comment ────────────────────────────────────────
      .addCase(deleteCommentThunk.pending, (state, action) => {
        state.deletingId = action.meta.arg.commentId;
        state.deleteError = null;
      })
      .addCase(deleteCommentThunk.fulfilled, (state, action) => {
        state.deletingId = null;
        const { postId, commentId } = action.payload;

        if (state.commentsByPost[postId]) {
          state.commentsByPost[postId].comments =
            state.commentsByPost[postId].comments.filter(
              (c) => c._id !== commentId,
            );
          state.commentsByPost[postId].totalComments = Math.max(
            0,
            state.commentsByPost[postId].totalComments - 1,
          );
        }
      })
      .addCase(deleteCommentThunk.rejected, (state, action) => {
        state.deletingId = null;
        state.deleteError = action.payload ?? "Failed to delete comment";
      });
  },
});

export const {
  setEditingId,
  clearEditingId,
  setSortOrder,
  clearComments,
  clearCommentError,
} = commentSlice.actions;

export default commentSlice.reducer;
