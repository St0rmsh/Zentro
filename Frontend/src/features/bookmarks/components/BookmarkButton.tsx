import React from "react";
import { Bookmark as BookmarkIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import {
  toggleBookmarkThunk,
  addBookmark,
  removeBookmark,
} from "../state/bookmarkSlice";

interface BookmarkButtonProps {
  postId: string;
  className?: string;
  isInitiallyBookmarked?: boolean;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  postId,
  className,
  isInitiallyBookmarked = false,
}) => {
  const dispatch = useAppDispatch();

  const bookmarkedPosts = useAppSelector(
    (state) => state.bookmarks.bookmarkedPosts
  );

  const loading = useAppSelector(
    (state) => state.bookmarks.loading
  );

  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated
  );

  /*
   * Redux is the source of truth once this post has been
   * registered in the bookmark state.
   *
   * The initial prop is only used to hydrate Redux when
   * the parent already knows the bookmark state.
   */
  const isInRedux = bookmarkedPosts.includes(postId);

  const isBookmarked = isInRedux || isInitiallyBookmarked;
  const isLoading = loading[postId] ?? false;

  const handleToggleBookmark = async () => {
    if (!isAuthenticated || isLoading) {
      return;
    }

    const willBookmark = !isBookmarked;

    // Optimistic Redux update
    if (willBookmark) {
      dispatch(addBookmark(postId));
    } else {
      dispatch(removeBookmark(postId));
    }

    try {
      const result = await dispatch(
        toggleBookmarkThunk(postId)
      ).unwrap();

      /*
       * Always reconcile Redux with the actual backend result.
       */
      const serverBookmarked =
        result.bookmark?.bookmarked ?? willBookmark;

      if (serverBookmarked) {
        dispatch(addBookmark(postId));
      } else {
        dispatch(removeBookmark(postId));
      }
    } catch {
      /*
       * Roll back optimistic update if API request fails.
       */
      if (willBookmark) {
        dispatch(removeBookmark(postId));
      } else {
        dispatch(addBookmark(postId));
      }
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`rounded-full hover:bg-muted group transition-all ${
        className ?? ""
      }`}
      onClick={handleToggleBookmark}
      disabled={isLoading}
      aria-label={
        isBookmarked
          ? "Remove bookmark"
          : "Bookmark post"
      }
    >
      <motion.div
        whileTap={{ scale: 0.8 }}
        animate={
          isBookmarked
            ? { scale: [1, 1.15, 1] }
            : {}
        }
        transition={{ duration: 0.3 }}
      >
        <BookmarkIcon
          className={`h-5 w-5 transition-colors ${
            isBookmarked
              ? "fill-primary text-primary"
              : "text-muted-foreground group-hover:text-primary/80"
          }`}
        />
      </motion.div>
    </Button>
  );
};