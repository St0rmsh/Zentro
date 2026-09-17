import { motion } from "framer-motion";
import { RecommendedPost } from "../types";
import { Clock, BookmarkPlus } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface RecommendationCardProps {
  post: RecommendedPost;
}

export const RecommendationCard = ({ post }: RecommendationCardProps) => {
  return (
    <motion.article 
      whileHover={{ y: -4 }}
      className="group relative flex flex-col justify-between bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
    >
      <div className="p-5 flex-1 flex flex-col">
        {post.reason && (
          <div className="text-[10px] uppercase tracking-wider font-semibold text-primary mb-3">
            {post.reason}
          </div>
        )}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
            {post.author.username.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-muted-foreground">@{post.author.username}</span>
        </div>
        <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
          {post.excerpt}
        </p>
      </div>
      
      <div className="p-5 pt-0 flex items-center justify-between mt-auto">
        <div className="flex items-center text-xs text-muted-foreground gap-3">
          <span>{new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readingTime} min</span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary rounded-full">
          <BookmarkPlus className="w-4 h-4" />
        </Button>
      </div>
    </motion.article>
  );
};
