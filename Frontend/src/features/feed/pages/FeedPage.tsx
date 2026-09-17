import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { fetchFeedThunk, refreshFeedThunk, clearFeedError } from "../state/feedSlice";
import { fetchRecommendationsStart, fetchTrendingSuccess, fetchUsersSuccess } from "@/features/recommendation/state/recommendationSlice";
import { recommendationService } from "@/features/recommendation/services/recommendation.service";
import { FeedHeader } from "../components/FeedHeader";
import { FeedCard } from "../components/FeedCard";
import { FeedSkeleton } from "../components/FeedSkeleton";
import { FeedEmpty } from "../components/FeedEmpty";
import { FeedError } from "../components/FeedError";
import { InfiniteLoader } from "../components/InfiniteLoader";
import { RefreshButton } from "../components/RefreshButton";
import { AnimatePresence } from "framer-motion";
import { SEO } from "@/shared/components/SEO";


export function FeedPage() {
  const dispatch = useAppDispatch();
  const { posts, loading, error, currentPage, hasNextPage } = useAppSelector((state) => state.feed);
  const activeTab = useAppSelector((state) => state.feed.activeTab);
    
  // Fetch feed and recommendations on mount or when tab changes
  useEffect(() => {
    dispatch(fetchFeedThunk(1));
    
    // Load recommendations (Mock API calls)
    const loadRecommendations = async () => {
      dispatch(fetchRecommendationsStart());
      try {
        const trending = await recommendationService.getTrending();
        dispatch(fetchTrendingSuccess(trending));
        
        const users = await recommendationService.getRecommendedUsers();
        dispatch(fetchUsersSuccess(users));
      } catch (err) {
        console.error("Failed to load recommendations", err);
      }
    };
    loadRecommendations();
    
    return () => {
      dispatch(clearFeedError());
    };
  }, [dispatch, activeTab]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasNextPage) {
      dispatch(fetchFeedThunk(currentPage + 1));
    }
  }, [loading, hasNextPage, currentPage, dispatch]);

  const handleRetry = () => {
    dispatch(fetchFeedThunk(1));
  };

  const isInitialLoad = loading && posts.length === 0;

  return (
    <div className="flex flex-col min-h-screen pb-10">
      <SEO title={`Zentro — ${activeTab === "home" ? "Smart Home" : "Following"} Feed`} />
      <FeedHeader />

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col gap-10">
            
            {/* Main Feed Content Area */}
          <div className="w-full space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight text-foreground capitalize">
                {activeTab === "home" ? "For You" : `${activeTab} Feed`}
              </h1>
              <RefreshButton />
            </div>

            {/* Initial Loading Skeletons */}
            {isInitialLoad && (
              <div className="space-y-6">
                <FeedSkeleton />
                <FeedSkeleton />
              </div>
            )}

            {/* Error State */}
            {!isInitialLoad && error && (
              <FeedError message={error} onRetry={handleRetry} />
            )}

            {/* Empty State */}
            {!isInitialLoad && !error && posts.length === 0 && (
              <FeedEmpty onRefresh={() => dispatch(refreshFeedThunk())} />
            )}

            {/* Standard Feed List */}
            {!isInitialLoad && posts.length > 0 && (
              <div className="space-y-8">
                <AnimatePresence mode="popLayout">
                  {posts.map((post, index) => (
                    <FeedCard key={post._id} post={post} index={index} />
                  ))}
                </AnimatePresence>

                <InfiniteLoader
                  onLoadMore={handleLoadMore}
                  loading={loading}
                  hasNextPage={hasNextPage}
                />
              </div>
            )}
          </div>

          
        </div>
      </div>
    </div>
  );
}
