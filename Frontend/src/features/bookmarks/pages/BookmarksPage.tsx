import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { fetchMyBookmarksThunk } from "../state/bookmarkSlice";
import { Bookmark, Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { motion } from "framer-motion";
import { FeedCard } from "@/features/feed/components/FeedCard";

export const BookmarksPage = () => {
  const dispatch = useAppDispatch();
  const { bookmarksList, isFetchingBookmarks, fetchError, hasNextPage, currentPage } = useAppSelector((state) => state.bookmarks);

  useEffect(() => {
    dispatch(fetchMyBookmarksThunk({ page: 1, limit: 10, append: false }));
  }, [dispatch]);

  const handleLoadMore = () => {
    dispatch(fetchMyBookmarksThunk({ page: currentPage + 1, limit: 10, append: true }));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border/40">
        <div className="p-3 bg-primary/10 rounded-xl text-primary">
          <Bookmark className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Saved Posts</h1>
          <p className="text-muted-foreground text-sm">Read them later</p>
        </div>
      </div>

      {isFetchingBookmarks && bookmarksList.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : fetchError ? (
        <div className="text-center py-20 text-destructive">{fetchError}</div>
      ) : bookmarksList.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-card border border-border/40 rounded-2xl"
        >
          <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-xl font-semibold mb-2">No bookmarks yet</h3>
          <p className="text-muted-foreground">Save your favorite posts to read them later.</p>
        </motion.div>
      ) : (
        <div className="flex flex-col space-y-6">
          {bookmarksList.map((bookmark, index) => (
            <FeedCard key={bookmark._id} post={bookmark.post} index={index} />
          ))}
          
          {hasNextPage && (
            <div className="pt-8 flex justify-center">
              <Button 
                variant="outline" 
                onClick={handleLoadMore} 
                disabled={isFetchingBookmarks}
                className="rounded-full px-8"
              >
                {isFetchingBookmarks ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
