import { Skeleton } from "@/shared/ui/skeleton";

export function FeedSkeleton() {
  return (
    <div className="flex flex-col bg-card/40 border border-border/20 rounded-2xl p-5 gap-4 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full bg-muted/40" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="w-24 h-4 bg-muted/40" />
            <Skeleton className="w-16 h-3 bg-muted/40" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-12 h-3 bg-muted/40" />
          <Skeleton className="w-16 h-5 rounded-full bg-muted/40" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton className="w-3/4 h-6 bg-muted/40" />
        <Skeleton className="w-full h-4 bg-muted/40" />
        <Skeleton className="w-full h-4 bg-muted/40" />
        <Skeleton className="w-5/6 h-4 bg-muted/40" />
      </div>

      {/* Image Skeleton */}
      <Skeleton className="w-full aspect-[16/9] rounded-xl bg-muted/30" />

      {/* Tags Skeleton */}
      <div className="flex gap-1.5">
        <Skeleton className="w-12 h-5 rounded-md bg-muted/40" />
        <Skeleton className="w-16 h-5 rounded-md bg-muted/40" />
        <Skeleton className="w-10 h-5 rounded-md bg-muted/40" />
      </div>

      {/* Footer Skeleton */}
      <div className="border-t border-border/10 pt-4 flex items-center justify-between mt-1">
        <div className="flex gap-4">
          <Skeleton className="w-12 h-4 bg-muted/40" />
          <Skeleton className="w-8 h-4 bg-muted/40" />
          <Skeleton className="w-8 h-4 bg-muted/40" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="w-20 h-4 bg-muted/40" />
          <Skeleton className="w-6 h-6 rounded-full bg-muted/40" />
          <Skeleton className="w-6 h-6 rounded-full bg-muted/40" />
        </div>
      </div>
    </div>
  );
}
