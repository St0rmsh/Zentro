import React, { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface InfiniteLoaderProps {
  onLoadMore: () => void;
  loading: boolean;
  hasNextPage: boolean;
}

export const InfiniteLoader = React.memo(function InfiniteLoader({ onLoadMore, loading, hasNextPage }: InfiniteLoaderProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: "200px" }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [onLoadMore, loading, hasNextPage]);

  if (!hasNextPage) return null;

  return (
    <div ref={sentinelRef} className="w-full flex justify-center py-6">
      {loading && (
        <Loader2 className="w-6 h-6 animate-spin text-primary opacity-80" />
      )}
    </div>
  );
});
