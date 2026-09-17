import { TrendingTag, TrendingCategory } from "../types";
import { Flame, FolderOpen } from "lucide-react";
import { motion } from "framer-motion";

interface TrendingTagsProps {
  tags: TrendingTag[];
}

export const TrendingTags = ({ tags }: TrendingTagsProps) => {
  if (!tags.length) return null;

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Flame className="w-5 h-5 text-rose-500" />
        Trending Topics
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <motion.div
            key={tag.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1.5 bg-muted hover:bg-primary/10 hover:text-primary rounded-full text-sm font-medium text-muted-foreground transition-colors cursor-pointer border border-transparent hover:border-primary/20"
          >
            #{tag.name}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

interface TrendingCategoriesProps {
  categories: TrendingCategory[];
}

export const TrendingCategories = ({ categories }: TrendingCategoriesProps) => {
  if (!categories.length) return null;

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <FolderOpen className="w-5 h-5 text-primary" />
        Popular Categories
      </h3>
      <div className="space-y-3">
        {categories.map((cat, i) => (
          <div key={cat.id} className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-muted-foreground w-4 group-hover:text-primary">{i + 1}</span>
              <span className="text-sm font-medium group-hover:text-foreground">{cat.name}</span>
            </div>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              {cat.postCount > 1000 ? `${(cat.postCount / 1000).toFixed(1)}k` : cat.postCount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
