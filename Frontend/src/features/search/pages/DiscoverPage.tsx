import { useEffect } from "react";
import { Compass, Users, Hash } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { fetchDiscoverData } from "../state/searchSlice";
import { TrendingTags } from "../components/TrendingTags";
import { SearchBar } from "../components/SearchBar";
import { FeedCard } from "@/features/feed/components/FeedCard";
import { FollowCard } from "@/features/follow/components/FollowCard";
import { motion } from "framer-motion";
import { PageLoader } from "@/shared/components/PageLoader";

export const DiscoverPage = () => {
  const dispatch = useAppDispatch();
  const { discoverLoading, trendingPosts, topUsers, trendingTags } = useAppSelector((state) => state.search);

  useEffect(() => {
    dispatch(fetchDiscoverData());
  }, [dispatch]);

  if (discoverLoading && trendingPosts.length === 0) {
    return <PageLoader />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-12 flex flex-col items-center text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Discover Zentro</h1>
        <p className="mb-8 max-w-xl text-lg text-muted-foreground">
          Explore trending posts, find inspiring authors, and dive into popular topics.
        </p>
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-12">
          {/* Trending Posts */}
          <section>
            <div className="mb-6 flex items-center gap-2 border-b pb-4">
              <Compass className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Trending Posts</h2>
            </div>
            <div className="w-full space-y-6">
              {trendingPosts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FeedCard key={post._id} post={post} index={index} />
                </motion.div>
              ))}
              {trendingPosts.length === 0 && !discoverLoading && (
                <p className="text-muted-foreground col-span-2">No trending posts found.</p>
              )}
            </div>
          </section>

          {/* Top Authors */}
          <section>
            <div className="mb-6 flex items-center gap-2 border-b pb-4">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Top Authors</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {topUsers.map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FollowCard user={user} />
                </motion.div>
              ))}
              {topUsers.length === 0 && !discoverLoading && (
                <p className="text-muted-foreground col-span-2">No authors found.</p>
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <TrendingTags tags={trendingTags} isLoading={discoverLoading} />
            
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                <Hash className="h-5 w-5 text-primary" /> Topics to Explore
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Technology', 'Programming', 'Design', 'Life', 'Productivity', 'Startup'].map((tag) => (
                  <a
                    key={tag}
                    href={`/search?q=${tag}`}
                    className="rounded-full border bg-muted/50 px-4 py-1.5 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
