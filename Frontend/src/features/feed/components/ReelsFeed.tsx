import { useEffect, useRef, useState } from "react";
import { Post } from "../types/feed.types";
import { ReelItem } from "./ReelItem";

interface ReelsFeedProps {
  posts: Post[];
  fetchMore: () => void;
  hasNextPage: boolean;
}

export function ReelsFeed({ posts, fetchMore, hasNextPage }: ReelsFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreObserverRef = useRef<IntersectionObserver | null>(null);

  // Handle active item detection for autoplay and view tracking
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveIndex(index);
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.6, // Trigger when 60% of the item is visible
      }
    );

    const items = document.querySelectorAll(".reel-item");
    items.forEach((item) => observerRef.current?.observe(item));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [posts.length]);

  // Handle infinite scroll
  useEffect(() => {
    const lastItem = document.querySelector(".reel-item:last-child");
    
    loadMoreObserverRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchMore();
        }
      },
      {
        root: containerRef.current,
        rootMargin: "200px",
      }
    );

    if (lastItem) {
      loadMoreObserverRef.current.observe(lastItem);
    }

    return () => {
      loadMoreObserverRef.current?.disconnect();
    };
  }, [posts, hasNextPage, fetchMore]);

  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] text-muted-foreground">
        No reels found.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="reels-container h-[calc(100vh-64px)] w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black"
      style={{ scrollBehavior: 'smooth' }}
    >
      {posts.map((post, index) => (
        <div key={post._id} data-index={index} className="h-full w-full snap-start relative">
          <ReelItem post={post} isActive={activeIndex === index} />
        </div>
      ))}
    </div>
  );
}
