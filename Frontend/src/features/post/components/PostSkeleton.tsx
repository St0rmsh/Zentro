/**
 * PostSkeleton — Loading skeleton for the Post Details page
 * Shows a shimmer animation while post data is being fetched
 */

import { motion } from "framer-motion";

export function PostSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-3xl mx-auto px-4 py-8 space-y-8"
      role="status"
      aria-label="Loading post..."
    >
      {/* Cover Image Skeleton */}
      <div className="w-full aspect-[2/1] rounded-2xl bg-muted/30 animate-pulse" />

      {/* Category */}
      <div className="flex gap-2">
        <div className="h-6 w-24 rounded-full bg-muted/30 animate-pulse" />
      </div>

      {/* Title */}
      <div className="space-y-3">
        <div className="h-10 w-full rounded-lg bg-muted/30 animate-pulse" />
        <div className="h-10 w-3/4 rounded-lg bg-muted/30 animate-pulse" />
      </div>

      {/* Author Meta */}
      <div className="flex items-center gap-3 pt-2">
        <div className="h-10 w-10 rounded-full bg-muted/30 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-muted/30 animate-pulse" />
          <div className="h-3 w-48 rounded bg-muted/30 animate-pulse" />
        </div>
      </div>

      {/* Content Lines */}
      <div className="space-y-4 pt-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-4 rounded bg-muted/20 animate-pulse"
            style={{ width: `${85 + Math.random() * 15}%`, animationDelay: `${i * 100}ms` }}
          />
        ))}
        <div className="h-4 w-2/3 rounded bg-muted/20 animate-pulse" />
      </div>

      {/* Interaction Bar Skeleton */}
      <div className="flex items-center gap-4 pt-6 border-t border-border/20">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-8 rounded-full bg-muted/20 animate-pulse"
          />
        ))}
      </div>

      <span className="sr-only">Loading post content...</span>
    </motion.div>
  );
}
