import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { setTab } from "../state/feedSlice";
import { FeedTab } from "../types/feed.types";
import { cn } from "@/shared/lib/utils";

interface TabItem {
  id: FeedTab;
  label: string;
}

export function FeedHeader() {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.feed.activeTab);

  const tabs: TabItem[] = [
    { id: "home", label: "For You" },
    { id: "trending", label: "Trending" },
    { id: "following", label: "Following" },
    { id: "recommended", label: "Recommended" },
  ];

  return (
    <div className="sticky top-16 md:top-0 bg-background/80 backdrop-blur-md border-b border-border/40 z-20 w-full">
      <div className="flex items-center justify-between px-4 h-14 max-w-2xl mx-auto">
        <nav className="flex space-x-1 relative w-full h-full items-center overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => dispatch(setTab(tab.id))}
                className={cn(
                  "relative px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 cursor-pointer select-none",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {/* Text Label */}
                <span className="relative z-10">{tab.label}</span>

                {/* Sliding background highlight */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-secondary/50 border-b-2 border-primary rounded-lg z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

      </div>
    </div>
  );
}
