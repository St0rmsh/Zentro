import React from "react";
import { Skeleton } from "@/shared/ui/skeleton";
import { motion } from "framer-motion";

export const CommentSkeleton: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex gap-4 p-4 border-b border-border/40"
    >
      <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-4 w-full max-w-md" />
        <Skeleton className="h-4 w-full max-w-sm" />
      </div>
    </motion.div>
  );
};

export const CommentListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="w-full flex flex-col">
      {Array.from({ length: count }).map((_, i) => (
        <CommentSkeleton key={i} />
      ))}
    </div>
  );
};
