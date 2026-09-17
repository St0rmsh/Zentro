import { useEffect, useState } from "react";
import { Search, FileText, Settings, Compass } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { setGlobalSearchOpen } from "@/store/slices/uiSlice";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/router/routes.config";
import { motion, AnimatePresence } from "framer-motion";
import { addRecentSearch, removeRecentSearch, clearRecentSearches } from "@/features/search/state/searchSlice";

export const CommandPalette = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { globalSearchOpen } = useAppSelector((state) => state.ui);
  const { recentSearches } = useAppSelector((state) => state.search);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        dispatch(setGlobalSearchOpen(!globalSearchOpen));
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [dispatch, globalSearchOpen]);

  const handleSelect = (path: string) => {
    dispatch(setGlobalSearchOpen(false));
    setSearch("");
    navigate(path);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      dispatch(addRecentSearch(search));
      handleSelect(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleRecentSearchClick = (query: string) => {
    dispatch(addRecentSearch(query));
    handleSelect(`/search?q=${encodeURIComponent(query)}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Dialog open={globalSearchOpen} onOpenChange={(open) => dispatch(setGlobalSearchOpen(open))}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden gap-0 rounded-2xl bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl">
        <DialogTitle className="sr-only">Command Palette</DialogTitle>
        <form onSubmit={handleSearchSubmit} className="flex items-center px-6 py-3 border-b border-border/50">
          <Search className="h-5 w-5 text-muted-foreground mr-3" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search..."
            className="border-0 shadow-none focus-visible:ring-0 px-1 h-12 text-lg bg-transparent placeholder:text-muted-foreground/60 w-full"
            autoFocus
          />
        </form>

        <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
          {!search && (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="px-2">
              <p className="text-xs font-semibold text-muted-foreground/70 px-3 mb-3 tracking-widest uppercase">Quick Actions</p>
              <div className="space-y-1.5">
                <motion.button
                  variants={itemVariants}
                  onClick={() => handleSelect(ROUTES.DISCOVER)}
                  className="group w-full flex items-center justify-between px-4 py-3.5 text-sm rounded-xl hover:bg-primary/10 transition-all duration-200 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      <Compass className="h-4 w-4" />
                    </div>
                    <span className="font-medium group-hover:text-primary transition-colors">Explore Trending Topics</span>
                  </div>
                  <span className="text-xs text-muted-foreground/50 group-hover:text-primary/70 transition-colors hidden sm:block">Explore</span>
                </motion.button>

                <motion.button
                  variants={itemVariants}
                  onClick={() => handleSelect(ROUTES.POSTS + "/new")}
                  className="group w-full flex items-center justify-between px-4 py-3.5 text-sm rounded-xl hover:bg-primary/10 transition-all duration-200 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      <FileText className="h-4 w-4" />
                    </div>
                    <span className="font-medium group-hover:text-primary transition-colors">Write a new post</span>
                  </div>
                  <span className="text-xs text-muted-foreground/50 group-hover:text-primary/70 transition-colors hidden sm:block">Write</span>
                </motion.button>

                <motion.button
                  variants={itemVariants}
                  onClick={() => handleSelect(ROUTES.SETTINGS)}
                  className="group w-full flex items-center justify-between px-4 py-3.5 text-sm rounded-xl hover:bg-primary/10 transition-all duration-200 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      <Settings className="h-4 w-4" />
                    </div>
                    <span className="font-medium group-hover:text-primary transition-colors">Account Settings</span>
                  </div>
                  <span className="text-xs text-muted-foreground/50 group-hover:text-primary/70 transition-colors hidden sm:block">Settings</span>
                </motion.button>
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {search && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="px-2 py-4"
              >
                <button
                  onClick={() => handleSearchSubmit({ preventDefault: () => {} } as React.FormEvent)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <Search className="h-4 w-4" />
                    <span className="font-medium">Search for "{search}"</span>
                  </div>
                  <span className="text-xs opacity-70">Press Enter</span>
                </button>
              </motion.div>
            )}

            {!search && recentSearches.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="px-2 mt-6"
              >
                <div className="flex items-center justify-between px-3 mb-3">
                  <p className="text-xs font-semibold text-muted-foreground/70 tracking-widest uppercase">Recent Searches</p>
                  <button onClick={() => dispatch(clearRecentSearches())} className="text-xs text-muted-foreground hover:text-foreground">Clear all</button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((query) => (
                    <div key={query} className="group w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-xl hover:bg-primary/5 transition-all">
                      <button onClick={() => handleRecentSearchClick(query)} className="flex-1 flex items-center gap-3 text-left">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{query}</span>
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); dispatch(removeRecentSearch(query)); }} className="p-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-foreground">
                        <span className="sr-only">Remove</span>&times;
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};
