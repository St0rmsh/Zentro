import { useState, useEffect } from "react";
import { TrendingUp, Hash, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";

import { fetchDiscoverData, addRecentSearch, setSearchQuery } from "@/features/search/state/searchSlice";
import type { Tag } from "@/features/search/types";
import { SearchBar } from "@/features/search/components/SearchBar";

export const RightSidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { rightSidebarOpen } = useAppSelector((state) => state.ui);
  const { trendingTags, topUsers, discoverLoading } = useAppSelector((state) => state.search);
  const [hasFetched, setHasFetched] = useState(false);

  // Fetch discover data once for trending tags and top users
  useEffect(() => {
    if (!hasFetched && rightSidebarOpen) {
      dispatch(fetchDiscoverData());
      setHasFetched(true);
    }
  }, [dispatch, hasFetched, rightSidebarOpen]);

  const handleTagClick = (tagName: string) => {
    dispatch(setSearchQuery(tagName));
    dispatch(addRecentSearch(tagName));
    navigate(`/search?q=${encodeURIComponent(tagName)}`);
  };

  if (!rightSidebarOpen) return null;

  return (
    <aside className="hidden lg:block w-[320px] sticky top-0 h-screen max-h-screen border-l border-border bg-background overflow-y-auto overscroll-contain z-30">
      <div className="p-5 space-y-6">
        {/* Actual Search Bar Component */}
        <div className="w-full rounded-2xl border border-border/60 bg-muted/30 overflow-hidden shadow-sm hover:border-primary/30 transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
          <SearchBar />
        </div>

        {/* Trending Tags — Real data from backend */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">Trending</h3>
          </div>
          {discoverLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 px-2 py-2">
                  <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                    <div className="h-2 w-16 rounded bg-muted/60 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : trendingTags.length > 0 ? (
            <div className="space-y-0.5">
              {trendingTags.slice(0, 6).map((tag: Tag, index: number) => (
                <button
                  key={tag.name}
                  onClick={() => handleTagClick(tag.name)}
                  className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/5 transition-all text-left"
                >
                  <div className="h-8 w-8 rounded-lg bg-primary/8 group-hover:bg-primary/15 flex items-center justify-center transition-colors flex-shrink-0">
                    <Hash className="h-3.5 w-3.5 text-primary/70 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                      {tag.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{tag.count} posts</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground/40 tabular-nums">
                    {index + 1}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground/60 px-2 py-4">No trending tags yet</p>
          )}
        </div>

        {/* Who to Follow — Real data from backend */}
        {topUsers.length > 0 && (
          <div className="pt-4 border-t border-border/40">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-violet-500" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">Suggested for you</h3>
            </div>
            <div className="space-y-0.5">
              {topUsers.slice(0, 4).map((user: any) => {
                const username = user.username || user.name || "";
                const displayName = user.name || username;
                const avatar = user.profileImage || user.avatar;
                return (
                  <Link
                    key={user._id}
                    to={`/app/profile/${username}`}
                    className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/50 transition-all"
                  >
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={displayName}
                        className="h-9 w-9 rounded-full object-cover border border-border/30 group-hover:border-primary/30 transition-colors flex-shrink-0"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-primary">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                        {displayName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">@{username}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Links */}
        <div className="pt-4 border-t border-border/40 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-muted-foreground/60">
          <a href="#" className="hover:underline hover:text-muted-foreground transition-colors">About</a>
          <a href="#" className="hover:underline hover:text-muted-foreground transition-colors">Help Center</a>
          <a href="#" className="hover:underline hover:text-muted-foreground transition-colors">Terms of Service</a>
          <a href="#" className="hover:underline hover:text-muted-foreground transition-colors">Privacy Policy</a>
          <p className="w-full mt-2">© 2026 Zentro</p>
        </div>
      </div>
    </aside>
  );
};
