import React, { useEffect } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { updatePostLikesCount } from "../../feed/state/feedSlice";
import { updatePostDetailLikesCount } from "../../post/state/postSlice";
import {
  toggleLikeThunk,
  addLike,
  removeLike,
  setLikeCount,
  updateLikeCount,
} from "../state/likeSlice";

interface LikeButtonProps {
  postId: string;
  className?: string;
  initialLikeCount?: number;
  isInitiallyLiked?: boolean;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
  className,
  initialLikeCount = 0,
  isInitiallyLiked = false,
}) => {
  const dispatch = useAppDispatch();

  const { likedPosts, likeCounts, loading } = useAppSelector(
    (state) => state.likes
  );

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const sharedLikeCount = likeCounts[postId];

  const displayCount =
    sharedLikeCount !== undefined
      ? sharedLikeCount
      : initialLikeCount;

  /*
   * Redux likedPosts is the authoritative state once it contains
   * information about this post.
   *
   * We only use isInitiallyLiked when the post has not yet been
   * represented in the global likedPosts state.
   */
  const hasGlobalLikeState = likedPosts.includes(postId);

  const isLiked = hasGlobalLikeState || isInitiallyLiked;

  const isLoading = loading[postId];

  /*
   * Initialize the shared count when this post is first rendered.
   *
   * We don't overwrite an existing shared count because another
   * FeedCard instance may already have updated it.
   */
  useEffect(() => {
    if (likeCounts[postId] === undefined) {
      dispatch(
        setLikeCount({
          postId,
          count: initialLikeCount,
        })
      );
    }
  }, [dispatch, postId, initialLikeCount, likeCounts]);

  /*
   * If the backend/feed supplies a newer initial count and we don't
   * have a shared value yet, initialize it.
   */
  useEffect(() => {
    if (
      likeCounts[postId] === undefined &&
      initialLikeCount >= 0
    ) {
      dispatch(
        setLikeCount({
          postId,
          count: initialLikeCount,
        })
      );
    }
  }, [dispatch, postId, initialLikeCount, likeCounts]);

  /*
   * If this component received the initial liked state from the
   * server and Redux hasn't loaded this post yet, synchronize it.
   */
  useEffect(() => {
    if (
      isInitiallyLiked &&
      !likedPosts.includes(postId)
    ) {
      dispatch(addLike(postId));
    }
  }, [dispatch, postId, isInitiallyLiked, likedPosts]);

  const handleToggleLike = async () => {
    if (!isAuthenticated || isLoading) {
      return;
    }

    const willLike = !isLiked;
    const delta = willLike ? 1 : -1;

    /*
     * -----------------------------------------
     * OPTIMISTIC UPDATE
     * -----------------------------------------
     */

    // Shared count — updates every LikeButton for this post.
    dispatch(
      updateLikeCount({
        postId,
        delta,
      })
    );

    /*
     * Keep existing Feed state synchronized for places that
     * still directly consume feed.posts.
     */
    dispatch(
      updatePostLikesCount({
        postId,
        delta,
      })
    );

    /*
     * Keep Post Detail synchronized.
     */
    dispatch(updatePostDetailLikesCount(delta));

    // Shared liked/unliked state.
    if (willLike) {
      dispatch(addLike(postId));
    } else {
      dispatch(removeLike(postId));
    }

    try {
      /*
       * Backend confirmation.
       */
      const result = await dispatch(
        toggleLikeThunk(postId)
      ).unwrap();

      /*
       * The backend is authoritative for liked/unliked state.
       */
      if (result.liked) {
        dispatch(addLike(postId));
      } else {
        dispatch(removeLike(postId));
      }
    } catch {
      /*
       * -----------------------------------------
       * ROLLBACK
       * -----------------------------------------
       */

      dispatch(
        updateLikeCount({
          postId,
          delta: -delta,
        })
      );

      dispatch(
        updatePostLikesCount({
          postId,
          delta: -delta,
        })
      );

      dispatch(updatePostDetailLikesCount(-delta));

      if (willLike) {
        dispatch(removeLike(postId));
      } else {
        dispatch(addLike(postId));
      }
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`gap-2 rounded-full hover:bg-muted group transition-all ${
        className ?? ""
      }`}
      onClick={handleToggleLike}
      disabled={isLoading}
      aria-label={isLiked ? "Unlike post" : "Like post"}
    >
      <motion.div
        whileTap={{ scale: 0.8 }}
        animate={
          isLiked
            ? { scale: [1, 1.2, 1] }
            : {}
        }
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={`h-5 w-5 transition-colors ${
            isLiked
              ? "fill-red-500 text-red-500"
              : "text-muted-foreground group-hover:text-red-500/80"
          }`}
        />
      </motion.div>

      <span
        className={`text-sm font-medium transition-colors ${
          isLiked
            ? "text-red-500"
            : "text-muted-foreground"
        }`}
      >
        {displayCount}
      </span>
    </Button>
  );
};