import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { motion } from "framer-motion";

interface CommentErrorProps {
  message?: string;
  onRetry?: () => void;
}

/**
 * Error state for the comments section.
 * Displays a friendly error message with an optional retry button.
 */
export const CommentError: React.FC<CommentErrorProps> = React.memo(
  ({ message = "Something went wrong loading comments.", onRetry }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 text-center gap-4"
      role="alert"
    >
      <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertCircle className="h-7 w-7 text-destructive" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">
          Failed to load comments
        </p>
        <p className="text-sm text-muted-foreground max-w-xs">{message}</p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="gap-2 rounded-full"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </motion.div>
  ),
);

CommentError.displayName = "CommentError";
