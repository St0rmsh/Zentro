import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/shared/lib/axios";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { 
  fetchCommentsThunk, 
  createCommentThunk, 
  updateCommentThunk, 
  deleteCommentThunk 
} from "../state/commentSlice";
import { CommentItem } from "./CommentItem";
import { CommentInput } from "./CommentInput";
import { CommentListSkeleton } from "./CommentSkeleton";
import { DeleteCommentDialog } from "./DeleteCommentDialog";
import { Button } from "@/shared/ui/button";
import { MessageSquare, Loader2, Zap, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { setPostCommentsCount } from "../../feed/state/feedSlice";
import { setPostDetailCommentsCount } from "../../post/state/postSlice";
import { setBookmarkCommentsCount } from "../../bookmarks/state/bookmarkSlice";

interface CommentListProps {
  postId: string;
}

export const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  const dispatch = useAppDispatch();
  const { commentsByPost, loading, creating, deletingId } = useAppSelector((state) => state.comments);
  const { user } = useAppSelector((state) => state.auth);
  
  const postComments = commentsByPost[postId];
  const comments = postComments?.comments || [];
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [vibe, setVibe] = useState<string | null>(null);
  const [vibeLoading, setVibeLoading] = useState(false);
  
  // AI Feature States
  const [threadSummary, setThreadSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [suggestedReplies, setSuggestedReplies] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    // Fetch first page of comments when mounted
    dispatch(fetchCommentsThunk({ postId, page: 1, limit: 10 }));
    
    // Fetch suggested replies (only returns if author)
    const fetchSuggestedReplies = async () => {
        setLoadingSuggestions(true);
        try {
            const res = await axiosInstance.get(`/comment/post/${postId}/suggested-replies`);
            setSuggestedReplies(res.data.data || []);
        } catch(e) {
            console.error("Failed to fetch suggested replies", e);
        } finally {
            setLoadingSuggestions(false);
        }
    };
    if (user) {
        fetchSuggestedReplies();
    }

    // Fetch vibe score
    const fetchVibe = async () => {
      setVibeLoading(true);
      try {
        const response = await axiosInstance.get(`/comment/post/${postId}/vibe`);
        setVibe(response.data.vibe);
      } catch (e) {
        console.error("Failed to fetch vibe");
      } finally {
        setVibeLoading(false);
      }
    };
    fetchVibe();
  }, [dispatch, postId]);

  const handleCreateComment = async (content: string) => {
    const result = await dispatch(createCommentThunk({ postId, content })).unwrap();
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
        const result = await dispatch(deleteCommentThunk({ postId, commentId: commentToDelete })).unwrap();
        dispatch(setPostCommentsCount({ postId, count: result.commentsCount }));
        dispatch(setBookmarkCommentsCount({ postId, count: result.commentsCount }));
        dispatch(setPostDetailCommentsCount(result.commentsCount));
      } finally {
        setDeleteDialogOpen(false);
        setCommentToDelete(null);
      }
    }
  };

  const handleLoadMore = () => {
    if (postComments?.hasNextPage) {
      dispatch(fetchCommentsThunk({ postId, page: postComments.currentPage + 1, limit: postComments.limit }));
    }
  };

  const handleSummarizeThread = async () => {
    setIsSummarizing(true);
    try {
      const response = await axiosInstance.get(`/ai/thread/${postId}/summary`);
      setThreadSummary(response.data.data);
    } catch (e) {
      console.error("Failed to summarize thread");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleApproveSuggestion = async (commentId: string) => {
      try {
          await axiosInstance.post(`/comment/${commentId}/approve`);
          setSuggestedReplies(prev => prev.filter(c => c._id !== commentId));
          // Refresh comments to show the newly approved one
          dispatch(fetchCommentsThunk({ postId, page: 1, limit: 10 }));
      } catch (e) {
          console.error("Approval failed", e);
      }
  };

  const handleRejectSuggestion = async (commentId: string) => {
      try {
          await axiosInstance.post(`/comment/${commentId}/reject`);
          setSuggestedReplies(prev => prev.filter(c => c._id !== commentId));
      } catch (e) {
          console.error("Rejection failed", e);
      }
  };

  // Determine skeleton vs real content
  const isInitialLoad = loading && comments.length === 0;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col space-y-6 bg-card border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between border-b border-border/40 pb-4 flex-wrap gap-4">
        <h3 className="text-2xl font-bold flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-primary" />
          Comments 
          {postComments?.totalComments !== undefined && (
            <span className="text-muted-foreground text-sm font-medium bg-muted px-2 py-0.5 rounded-full">
              {postComments.totalComments}
            </span>
          )}
        </h3>

        {/* Vibe Check Badge */}
        <div className="flex items-center gap-2">
            {vibeLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground px-3 py-1 bg-muted rounded-full">
                   <Loader2 className="w-4 h-4 animate-spin" />
                   Vibe Check...
                </div>
            ) : vibe ? (
                <div className="flex items-center gap-1.5 text-sm font-medium px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full">
                   <Zap className="w-4 h-4 fill-primary/20" />
                   {vibe}
                </div>
            ) : null}
            
            {comments.length > 3 && (
                <Button 
                   variant="outline" 
                   size="sm" 
                   onClick={handleSummarizeThread} 
                   disabled={isSummarizing}
                   className="rounded-full flex items-center gap-2"
                >
                    {isSummarizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Summarize Thread
                </Button>
            )}
        </div>
      </div>

      {threadSummary && (
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl text-sm leading-relaxed mb-6">
              <div className="flex items-center gap-2 font-bold mb-2 text-primary">
                  <Sparkles className="w-4 h-4" /> AI Summary
              </div>
              {threadSummary}
          </div>
      )}

      {suggestedReplies.length > 0 && (
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl mb-6">
              <div className="flex items-center gap-2 font-bold mb-3 text-primary">
                  <Sparkles className="w-4 h-4" /> Suggested AI Replies for You
              </div>
              <div className="flex flex-col gap-3">
                  {suggestedReplies.map((reply) => (
                      <div key={reply._id} className="bg-background border rounded-lg p-3">
                          <p className="text-sm text-foreground mb-3">{reply.content}</p>
                          <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleApproveSuggestion(reply._id)}>Approve & Post</Button>
                              <Button size="sm" variant="ghost" onClick={() => handleRejectSuggestion(reply._id)}>Reject</Button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {user ? (
        <div className="mb-6">
          <CommentInput
            currentUser={user}
            onSubmit={handleCreateComment}
            isLoading={creating}
          />
        </div>
      ) : (
        <div className="p-4 border rounded-xl bg-card text-center mb-6">
          <p className="text-muted-foreground mb-2">Log in to leave a comment.</p>
          {/* Optional: Add a link to login */}
        </div>
      )}

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
            <div className="pt-6 flex justify-center">
              <Button 
                variant="outline" 
                onClick={handleLoadMore} 
                disabled={loading}
                className="rounded-full px-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More Comments"
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
          <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p>No comments yet. Be the first to share your thoughts!</p>
        </motion.div>
      )}

      <DeleteCommentDialog
        isOpen={deleteDialogOpen}
        onClose={() => !deletingId && setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={!!deletingId}
      />
    </div>
  );
};
