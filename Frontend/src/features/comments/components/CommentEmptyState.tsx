import React from "react";
import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

interface CommentEmptyStateProps {
  message?: string;
}

/**
 * Beautiful empty state shown when a post has no comments.
 */
export const CommentEmptyState: React.FC<CommentEmptyStateProps> = React.memo(
  ({ message = "No comments yet. Be the first to share your thoughts!" }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-16 text-center gap-4"
    >
      <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center">
        <MessageSquare className="h-8 w-8 text-muted-foreground/40" />
      </div>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
        {message}
      </p>
    </motion.div>
  ),
);

CommentEmptyState.displayName = "CommentEmptyState";
