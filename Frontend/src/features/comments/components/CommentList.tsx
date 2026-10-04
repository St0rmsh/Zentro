import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/shared/lib/axios";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import {
  fetchCommentsThunk,
  createCommentThunk,
  updateCommentThunk,
  deleteCommentThunk,
} from "../state/commentSlice";
import { CommentItem } from "./CommentItem";
import { CommentInput } from "./CommentInput";
import { CommentListSkeleton } from "./CommentSkeleton";
import { DeleteCommentDialog } from "./DeleteCommentDialog";
import { Button } from "@/shared/ui/button";
import {
  AlertCircle,
  Check,
  Copy,
  Lock,
  Loader2,
  MessageSquare,
  RefreshCw,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { setPostCommentsCount } from "../../feed/state/feedSlice";
import { setPostDetailCommentsCount } from "../../post/state/postSlice";
import { setBookmarkCommentsCount } from "../../bookmarks/state/bookmarkSlice";

interface CommentListProps {
  postId: string;
}

interface SuggestedReply {
  _id: string;
  content: string;
}

type PendingAction = "approve" | "reject";

export const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  const dispatch = useAppDispatch();
  const { commentsByPost, loading, creating, deletingId } = useAppSelector(
    (state) => state.comments
  );
  const { user } = useAppSelector((state) => state.auth);

  const postComments = commentsByPost[postId];
  const comments = postComments?.comments || [];
  const totalComments = postComments?.totalComments;
  const remainingComments =
    totalComments !== undefined
      ? Math.max(0, totalComments - comments.length)
      : 0;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  // Vibe
  const [vibe, setVibe] = useState<string | null>(null);
  const [vibeLoading, setVibeLoading] = useState(false);

  // Thread summary
  const [threadSummary, setThreadSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const [summaryCopied, setSummaryCopied] = useState(false);

  // Suggested replies (author only)
  const [suggestedReplies, setSuggestedReplies] = useState<SuggestedReply[]>(
    []
  );
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [pendingActions, setPendingActions] = useState<
    Record<string, PendingAction>
  >({});
  const [suggestionError, setSuggestionError] = useState("");

  /* ---------------------------------------------------------------------- */
  /* Data loading                                                            */
  /* ---------------------------------------------------------------------- */

  // Comments (first page)
  useEffect(() => {
    dispatch(fetchCommentsThunk({ postId, page: 1, limit: 10 }));
  }, [dispatch, postId]);

  // Vibe score
  useEffect(() => {
    let cancelled = false;

    setVibe(null);
    setVibeLoading(true);

    axiosInstance
      .get(`/comment/post/${postId}/vibe`)
      .then((response) => {
        if (!cancelled) setVibe(response.data.vibe);
      })
      .catch(() => {
        if (!cancelled) setVibe(null);
      })
      .finally(() => {
        if (!cancelled) setVibeLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [postId]);

  // Suggested replies (only returns data for the post author)
  useEffect(() => {
    let cancelled = false;

    setSuggestedReplies([]);
    setSuggestionError("");
    setPendingActions({});

    if (!user?._id) {
      setLoadingSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);

    axiosInstance
      .get(`/comment/post/${postId}/suggested-replies`)
      .then((res) => {
        if (!cancelled) setSuggestedReplies(res.data.data || []);
      })
      .catch(() => {
        if (!cancelled) setSuggestedReplies([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingSuggestions(false);
      });

    return () => {
      cancelled = true;
    };
  }, [postId, user?._id]);

  /* ---------------------------------------------------------------------- */
  /* Comment actions                                                         */
  /* ---------------------------------------------------------------------- */

  const handleCreateComment = async (content: string) => {
    const result = await dispatch(
      createCommentThunk({ postId, content })
    ).unwrap();
    dispatch(setPostCommentsCount({ postId, count: result.commentsCount }));
    dispatch(setBookmarkCommentsCount({ postId, count: result.commentsCount }));
    dispatch(setPostDetailCommentsCount(result.commentsCount));
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    await dispatch(updateCommentThunk({ postId, commentId, content })).unwrap();
  };

  const handleDeleteRequest = (commentId: string) => {
    setCommentToDelete(commentId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (commentToDelete) {
      try {
        const result = await dispatch(
          deleteCommentThunk({ postId, commentId: commentToDelete })
        ).unwrap();
        dispatch(setPostCommentsCount({ postId, count: result.commentsCount }));
        dispatch(
          setBookmarkCommentsCount({ postId, count: result.commentsCount })
        );
        dispatch(setPostDetailCommentsCount(result.commentsCount));
      } finally {
        setDeleteDialogOpen(false);
        setCommentToDelete(null);
      }
    }
  };

  const handleLoadMore = () => {
    if (postComments?.hasNextPage) {
      dispatch(
        fetchCommentsThunk({
          postId,
          page: postComments.currentPage + 1,
          limit: postComments.limit,
        })
      );
    }
  };

  /* ---------------------------------------------------------------------- */
  /* AI actions                                                              */
  /* ---------------------------------------------------------------------- */

  const handleSummarizeThread = async () => {
    setIsSummarizing(true);
    setSummaryError("");
    try {
      const response = await axiosInstance.get(`/ai/thread/${postId}/summary`);
      setThreadSummary(response.data.data);
    } catch {
      setSummaryError("Couldn't summarize this thread. Please try again.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleCopySummary = async () => {
    if (!threadSummary) return;
    try {
      await navigator.clipboard.writeText(threadSummary);
      setSummaryCopied(true);
      setTimeout(() => setSummaryCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  const dismissSummary = () => {
    setThreadSummary(null);
    setSummaryError("");
    setSummaryCopied(false);
  };

  const runSuggestionAction = async (
    commentId: string,
    action: PendingAction
  ) => {
    setSuggestionError("");
    setPendingActions((current) => ({ ...current, [commentId]: action }));

    try {
      await axiosInstance.post(`/comment/${commentId}/${action}`);
      setSuggestedReplies((prev) => prev.filter((c) => c._id !== commentId));

      if (action === "approve") {
        // Refresh comments so the newly approved reply appears
        dispatch(fetchCommentsThunk({ postId, page: 1, limit: 10 }));
      }
    } catch {
      setSuggestionError(
        action === "approve"
          ? "Couldn't post that reply. Please try again."
          : "Couldn't reject that reply. Please try again."
      );
    } finally {
      setPendingActions((current) => {
        const next = { ...current };
        delete next[commentId];
        return next;
      });
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Render                                                                  */
  /* ---------------------------------------------------------------------- */

  const isInitialLoad = loading && comments.length === 0;

  return (
    <section
      aria-labelledby="comments-heading"
      aria-busy={isInitialLoad || loadingSuggestions}
      className="mx-auto flex w-full max-w-4xl flex-col space-y-6 rounded-2xl border border-border/50 bg-card p-4 shadow-sm sm:p-8"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-4">
        <h2
          id="comments-heading"
          className="flex items-center gap-3 text-xl font-bold sm:text-2xl"
        >
          <MessageSquare className="h-6 w-6 text-primary" />
          Comments
          {totalComments !== undefined && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-sm font-medium text-muted-foreground">
              {totalComments}
            </span>
          )}
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          {vibeLoading ? (
            <div
              className="h-7 w-24 animate-pulse rounded-full bg-muted"
              aria-label="Checking the vibe"
            />
          ) : vibe ? (
            <div
              title="AI-generated mood of this discussion"
              className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
            >
              <Zap className="h-4 w-4 fill-primary/20" />
              {vibe}
            </div>
          ) : null}

          {comments.length > 3 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSummarizeThread}
              disabled={isSummarizing}
              className="flex items-center gap-2 rounded-full"
            >
              {isSummarizing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : threadSummary ? (
                <RefreshCw className="h-4 w-4" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isSummarizing
                ? "Summarizing…"
                : threadSummary
                  ? "Re-summarize"
                  : "Summarize thread"}
            </Button>
          )}
        </div>
      </div>

      {/* AI results */}
      <div aria-live="polite" className="space-y-4 empty:hidden">
        <AnimatePresence initial={false}>
          {summaryError && (
            <motion.div
              key="summary-error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="flex-1">{summaryError}</span>
              <button
                type="button"
                onClick={() => setSummaryError("")}
                className="rounded-full p-0.5 hover:bg-destructive/10"
                aria-label="Dismiss error"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}

          {threadSummary && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-bold text-primary">
                  <Sparkles className="h-4 w-4" />
                  AI Summary
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label={summaryCopied ? "Summary copied" : "Copy summary"}
                    title={summaryCopied ? "Copied" : "Copy"}
                  >
                    {summaryCopied ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={dismissSummary}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label="Dismiss summary"
                    title="Dismiss"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="whitespace-pre-wrap text-foreground">
                {threadSummary}
              </p>

              <p className="mt-3 text-[11px] text-muted-foreground">
                Generated by AI from this discussion. It may miss nuance.
              </p>
            </motion.div>
          )}

          {suggestedReplies.length > 0 && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-xl border border-primary/20 bg-primary/5 p-4"
            >
              <div className="mb-1 flex flex-wrap items-center gap-2 font-bold text-primary">
                <Sparkles className="h-4 w-4" />
                Suggested AI replies for you
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold">
                  {suggestedReplies.length}
                </span>
              </div>

              <p className="mb-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Lock className="h-3 w-3" />
                Only visible to you. Nothing is posted until you approve it.
              </p>

              {suggestionError && (
                <div
                  role="alert"
                  className="mb-3 flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-2.5 text-xs text-destructive"
                >
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span className="flex-1">{suggestionError}</span>
                  <button
                    type="button"
                    onClick={() => setSuggestionError("")}
                    className="rounded-full p-0.5 hover:bg-destructive/10"
                    aria-label="Dismiss error"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              <ul className="flex flex-col gap-3">
                <AnimatePresence initial={false}>
                  {suggestedReplies.map((reply) => {
                    const pending = pendingActions[reply._id];

                    return (
                      <motion.li
                        key={reply._id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-lg border bg-background p-3"
                      >
                        <p className="mb-3 whitespace-pre-wrap text-sm text-foreground">
                          {reply.content}
                        </p>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            disabled={Boolean(pending)}
                            onClick={() =>
                              runSuggestionAction(reply._id, "approve")
                            }
                          >
                            {pending === "approve" && (
                              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                            )}
                            {pending === "approve"
                              ? "Posting…"
                              : "Approve & Post"}
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={Boolean(pending)}
                            onClick={() =>
                              runSuggestionAction(reply._id, "reject")
                            }
                          >
                            {pending === "reject" && (
                              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                            )}
                            {pending === "reject" ? "Rejecting…" : "Reject"}
                          </Button>
                        </div>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Composer */}
      {user ? (
        <div>
          <CommentInput
            currentUser={user}
            onSubmit={handleCreateComment}
            isLoading={creating}
          />
        </div>
      ) : (
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-muted-foreground">Log in to leave a comment.</p>
        </div>
      )}

      {/* List */}
      {isInitialLoad ? (
        <CommentListSkeleton count={3} />
      ) : comments.length > 0 ? (
        <div className="flex flex-col">
          <AnimatePresence initial={false}>
            {comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                currentUserId={user?._id}
                onEdit={handleUpdateComment}
                onDelete={handleDeleteRequest}
              />
            ))}
          </AnimatePresence>

          {postComments?.hasNextPage && (
            <div className="flex justify-center pt-6">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={loading}
                className="rounded-full px-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading…
                  </>
                ) : remainingComments > 0 ? (
                  `Load ${remainingComments} more comment${
                    remainingComments !== 1 ? "s" : ""
                  }`
                ) : (
                  "Load more comments"
                )}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-12 text-center text-muted-foreground"
        >
          <MessageSquare className="mx-auto mb-3 h-12 w-12 opacity-20" />
          <p className="font-medium text-foreground">No comments yet</p>
          <p className="mt-1 text-sm">
            Be the first to share your thoughts!
          </p>
        </motion.div>
      )}

      <DeleteCommentDialog
        isOpen={deleteDialogOpen}
        onClose={() => !deletingId && setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={!!deletingId}
      />
    </section>
  );
};