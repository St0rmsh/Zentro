import { Hash, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Tag } from "../types";

interface TrendingTagsProps {
  tags: Tag[];
  isLoading?: boolean;
}

export const TrendingTags = ({ tags, isLoading }: TrendingTagsProps) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 font-semibold">
          <TrendingUp className="h-4 w-4 text-primary" /> Trending Tags
        </h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                <div className="h-2 w-16 rounded bg-muted/60 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!tags.length) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 font-semibold">
        <TrendingUp className="h-4 w-4 text-primary" /> Trending Tags
      </h3>
      <div className="space-y-3">
        {tags.map((tag, index) => (
          <motion.div
            key={tag.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to={`/search?q=${encodeURIComponent(tag.name)}`}
              className="group flex items-center justify-between rounded-xl p-2 hover:bg-primary/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Hash className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium leading-none">{tag.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{tag.count} posts</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
