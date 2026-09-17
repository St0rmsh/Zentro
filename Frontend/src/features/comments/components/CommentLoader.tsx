import React from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface CommentLoaderProps {
  text?: string;
}

/**
 * Inline loading spinner shown during comment operations
 * (e.g. load more, submit, etc.).
 */
export const CommentLoader: React.FC<CommentLoaderProps> = React.memo(
  ({ text = "Loading..." }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center gap-2 py-6 text-muted-foreground"
    >
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm">{text}</span>
    </motion.div>
  ),
);

CommentLoader.displayName = "CommentLoader";
