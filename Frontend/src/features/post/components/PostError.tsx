/**
 * PostError — Error state for the Post Details page
 * Shows a retry button and error message
 */

import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PostErrorProps {
  message: string;
  onRetry: () => void;
}

export function PostError({ message, onRetry }: PostErrorProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center"
      role="alert"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-red-500/10 blur-2xl rounded-full" />
        <div className="relative w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
      </div>

      <h2 className="text-xl font-bold text-foreground mb-2">
        Failed to load post
      </h2>

      <p className="text-sm text-muted-foreground max-w-sm mb-8 leading-relaxed">
        {message}
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground bg-muted/20 hover:bg-muted/40 border border-border/40 rounded-xl transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>

        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-all duration-200 shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </motion.div>
  );
}
