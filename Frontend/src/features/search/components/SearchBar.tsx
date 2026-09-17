import { useState, useEffect, useRef, useCallback, type FormEvent, type KeyboardEvent } from "react";
import { Search, X, Clock, TrendingUp, User, FileText, Hash, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import {
  setSearchQuery,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
  fetchSearchOverview,
  clearSearchResults,
} from "../state/searchSlice";
import { Input } from "@/shared/ui/input";
import { motion, AnimatePresence } from "framer-motion";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export const SearchBar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { recentSearches, overviewLoading, overviewPosts, overviewUsers, overviewTags } =
    useAppSelector((state) => state.search);

  const [localQuery, setLocalQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(localQuery, 300);

  // Fetch overview results when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      dispatch(fetchSearchOverview(debouncedQuery.trim()));
    }
  }, [debouncedQuery, dispatch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown = isFocused && (localQuery.trim().length > 0 || recentSearches.length > 0);

  // Build suggestion items for keyboard nav
  const getSuggestionItems = useCallback(() => {
    const items: { type: string; value: string; data?: any }[] = [];

    if (localQuery.trim().length >= 2) {
      // "Search for" item
      items.push({ type: "search", value: localQuery.trim() });
      // Users
      overviewUsers.slice(0, 3).forEach((u) =>
        items.push({ type: "user", value: (u as any).username || (u as any).name, data: u })
      );
      // Posts
      overviewPosts.slice(0, 3).forEach((p) =>
        items.push({ type: "post", value: (p as any).title || "", data: p })
      );
      // Tags
      overviewTags.slice(0, 3).forEach((t) =>
        items.push({ type: "tag", value: t.name, data: t })
      );
    } else {
      // Recent searches
      recentSearches.slice(0, 5).forEach((q) =>
        items.push({ type: "recent", value: q })
      );
    }
    return items;
  }, [localQuery, overviewUsers, overviewPosts, overviewTags, recentSearches]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      dispatch(setSearchQuery(localQuery));
      dispatch(addRecentSearch(localQuery));
      navigate(`/search?q=${encodeURIComponent(localQuery.trim())}`);
      setIsFocused(false);
    }
  };

  const handleSelectSearch = (query: string) => {
    dispatch(setSearchQuery(query));
    dispatch(addRecentSearch(query));
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setIsFocused(false);
    setLocalQuery(query);
  };

  const handleClear = () => {
    setLocalQuery("");
    dispatch(clearSearchResults());
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const items = getSuggestionItems();
    if (!showDropdown || items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      const item = items[selectedIndex];
      if (item.type === "user") {
        navigate(`/app/profile/${item.value}`);
        setIsFocused(false);
      } else if (item.type === "post") {
        navigate(`/posts/${item.data?._id}`);
        setIsFocused(false);
      } else if (item.type === "tag") {
        handleSelectSearch(item.value);
      } else {
        handleSelectSearch(item.value);
      }
    } else if (e.key === "Escape") {
      setIsFocused(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative w-full group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors z-10">
          {overviewLoading && localQuery.trim().length >= 2 ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-border/40 group-focus-within:bg-primary/50 transition-colors pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          value={localQuery}
          onChange={(e) => {
            setLocalQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search posts, users, tags..."
          className="w-full pl-12 pr-12 h-14 rounded-none border-b-2 border-transparent bg-transparent hover:bg-muted/10 focus:bg-transparent focus-visible:ring-0 focus-visible:border-primary shadow-none transition-all text-lg"
          autoComplete="off"
        />
        {localQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground transition-colors z-10"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 bg-background/98 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* When no query — show recent searches */}
              {localQuery.trim().length < 2 && recentSearches.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Recent Searches
                      </span>
                    </div>
                    <button
                      onClick={() => dispatch(clearRecentSearches())}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="space-y-0.5">
                    {recentSearches.slice(0, 5).map((query, idx) => (
                      <div
                        key={query}
                        className={`group flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
                          selectedIndex === idx
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted/60"
                        }`}
                        onClick={() => handleSelectSearch(query)}
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-muted-foreground/60" />
                          <span className="text-sm font-medium">{query}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(removeRecentSearch(query));
                          }}
                          className="p-1 text-muted-foreground/40 opacity-0 group-hover:opacity-100 hover:text-foreground transition-all"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* When query — show live results */}
              {localQuery.trim().length >= 2 && (
                <div className="p-3">
                  {/* Search for "query" action */}
                  <button
                    onClick={() => handleSelectSearch(localQuery.trim())}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left mb-1 ${
                      selectedIndex === 0
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Search className="h-4 w-4" />
                      <span className="font-medium text-sm">
                        Search for "<span className="text-primary">{localQuery.trim()}</span>"
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span>Enter</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </button>

                  {/* Users results */}
                  {overviewUsers.length > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 px-3 py-1.5">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                          People
                        </span>
                      </div>
                      {overviewUsers.slice(0, 3).map((user, idx) => {
                        const itemIdx = 1 + idx;
                        const username = (user as any).username || (user as any).name || "";
                        const displayName = (user as any).name || username;
                        const avatar = (user as any).profileImage || (user as any).avatar;
                        return (
                          <Link
                            key={(user as any)._id}
                            to={`/app/profile/${username}`}
                            onClick={() => setIsFocused(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                              selectedIndex === itemIdx
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-muted/60"
                            }`}
                          >
                            {avatar ? (
                              <img
                                src={avatar}
                                alt={displayName}
                                className="h-8 w-8 rounded-full object-cover border border-border/40"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{displayName}</p>
                              <p className="text-xs text-muted-foreground truncate">@{username}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {/* Posts results */}
                  {overviewPosts.length > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 px-3 py-1.5">
                        <FileText className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                          Posts
                        </span>
                      </div>
                      {overviewPosts.slice(0, 3).map((post, idx) => {
                        const itemIdx = 1 + overviewUsers.slice(0, 3).length + idx;
                        const title = (post as any).title || "Untitled";
                        const author = (post as any).author?.name || (post as any).author?.username || "";
                        return (
                          <Link
                            key={(post as any)._id}
                            to={`/posts/${(post as any)._id}`}
                            onClick={() => setIsFocused(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                              selectedIndex === itemIdx
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-muted/60"
                            }`}
                          >
                            <div className="h-8 w-8 rounded-lg bg-muted/60 flex items-center justify-center flex-shrink-0">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{title}</p>
                              {author && (
                                <p className="text-xs text-muted-foreground truncate">by {author}</p>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {/* Tags results */}
                  {overviewTags.length > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 px-3 py-1.5">
                        <Hash className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                          Tags
                        </span>
                      </div>
                      {overviewTags.slice(0, 3).map((tag, idx) => {
                        const itemIdx =
                          1 + overviewUsers.slice(0, 3).length + overviewPosts.slice(0, 3).length + idx;
                        return (
                          <button
                            key={tag.name}
                            onClick={() => handleSelectSearch(tag.name)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left ${
                              selectedIndex === itemIdx
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-muted/60"
                            }`}
                          >
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Hash className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">#{tag.name}</p>
                              <p className="text-xs text-muted-foreground">{tag.count} posts</p>
                            </div>
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-500/70 flex-shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* No results state */}
                  {!overviewLoading &&
                    overviewUsers.length === 0 &&
                    overviewPosts.length === 0 &&
                    overviewTags.length === 0 &&
                    debouncedQuery.trim().length >= 2 && (
                      <div className="px-4 py-8 text-center">
                        <Search className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">
                          No results found for "{localQuery.trim()}"
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          Try different keywords or check spelling
                        </p>
                      </div>
                    )}
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2.5 border-t border-border/40 bg-muted/20 flex items-center justify-between text-[11px] text-muted-foreground/60">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/50 text-[10px] font-mono">↑</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/50 text-[10px] font-mono">↓</kbd>
                  <span className="ml-0.5">Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/50 text-[10px] font-mono">↵</kbd>
                  <span className="ml-0.5">Select</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/50 text-[10px] font-mono">Esc</kbd>
                  <span className="ml-0.5">Close</span>
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
