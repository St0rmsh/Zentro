import { useEffect, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Eye,
  Share2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { LikeButton } from "../../likes/components/LikeButton";
import { BookmarkButton } from "../../bookmarks/components/BookmarkButton";
import { updateReadingProgress } from "../state/feedSlice";
import { Post } from "../types/feed.types";
import { AuthorCard } from "./AuthorCard";
import { CategoryChip } from "./CategoryChip";
import { TagChip } from "./TagChip";
import { ReadingTimeBadge } from "./ReadingTimeBadge";
import { ReadingProgressBar } from "./ReadingProgressBar";

interface FeedCardProps {
  post: Post;
  index: number;
}

function getPreviewText(content: string): string {
  const document = new DOMParser().parseFromString(content, "text/html");
  return (document.body.textContent || content).replace(/\s+/g, " ").trim();
}

export const FeedCard = memo(function FeedCard({ post, index }: FeedCardProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const progress = useAppSelector((state) => state.feed.readingProgress[post._id] || 0);
  const likedPosts = useAppSelector((state) => state.likes.likedPosts);
  const feedPost = useAppSelector((state) => state.feed.posts.find((item) => item._id === post._id));
  const bookmarkPost = useAppSelector((state) => state.bookmarks.bookmarksList.find((item) => (item.post?._id ?? item.post) === post._id)?.post);
  const autoPlayMedia = useAppSelector((state) => state.settings.preferences.autoPlayMedia);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [displayPost, setDisplayPost] = useState<Post>(post);

  const resolvedPost = (feedPost ?? bookmarkPost ?? displayPost ?? post) as Post;
  const safeTags = Array.isArray(resolvedPost.tags) ? resolvedPost.tags : [];

  useEffect(() => {
    setDisplayPost((current) => {
      if (feedPost) {
        return feedPost;
      }
      if (bookmarkPost) {
        return bookmarkPost;
      }
      return current;
    });
  }, [feedPost, bookmarkPost]);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const postUrl = `${window.location.origin}/posts/${post._id}`;
    navigator.clipboard.writeText(postUrl)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy link.");
      });
  };

  // Simulate reading progress update on click / hover to demonstrate architecture
  const handleCardClick = () => {
    if (progress < 100) {
      const nextProgress = progress === 0 ? 30 : progress === 30 ? 75 : 100;
      dispatch(updateReadingProgress({ postId: post._id, progress: nextProgress }));
    }
    navigate(`/posts/${post._id}`);
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/posts/${post._id}#comments`);
  };

  // Helper to get formatted elapsed time
  const getElapsedTime = (dateString: string) => {
    const now = new Date();
    const created = new Date(dateString);
    const diffMs = now.getTime() - created.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${Math.max(1, diffMins)}m ago`;
    }
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3), ease: "easeOut" }}
      className="group relative mx-auto flex w-full max-w-2xl flex-col bg-card/60 backdrop-blur-md border border-border/40 hover:border-primary/30 rounded-xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md"
      onClick={handleCardClick}
    >
      {/* Top Reading Progress Bar (Obsidian/IDE aesthetic) */}
      {progress > 0 && <ReadingProgressBar progress={progress} className="absolute top-0 right-0 left-0 z-10 h-0.75" />}

      {/* Card Body */}
      <div className="p-4 md:p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <AuthorCard author={resolvedPost.user || { _id: "unknown", username: "user", fullname: "User" }} />
          
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground/80">{getElapsedTime(resolvedPost.createdAt)}</span>
            <CategoryChip category={resolvedPost.category} />
          </div>
        </div>

        {/* Title & Preview */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg md:text-xl font-bold leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
            {resolvedPost.title}
          </h2>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {getPreviewText(resolvedPost.content)}
          </p>
        </div>

        {/* Cover Image (if available) */}
        {(resolvedPost.coverImage || (resolvedPost.mediaType === "video" && resolvedPost.mediaUrl)) && (
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-muted/20 border border-border/20">
            {resolvedPost.mediaType === "video" && resolvedPost.mediaUrl ? (
              <video
                src={resolvedPost.mediaUrl}
                poster={resolvedPost.coverImage}
                autoPlay={autoPlayMedia}
                muted
                loop
                controls
                playsInline
                className="w-full h-full object-cover"
                aria-label={resolvedPost.title}
              />
            ) : <motion.img
                src={resolvedPost.coverImage}
                alt={resolvedPost.title}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                animate={{ opacity: imageLoaded ? 1 : 0, scale: imageLoaded ? 1 : 1.03 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
              />}
            
            {/* Image Loading Skeleton */}
            {resolvedPost.mediaType !== "video" && !imageLoaded && (
              <div className="absolute inset-0 bg-muted/30 animate-pulse" />
            )}

            {/* Reading progress overlay badge */}
            {progress > 0 && progress < 100 && (
              <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-md text-[10px] font-semibold text-primary px-2 py-1 rounded-full border border-primary/20 shadow-sm">
                Continue Reading ({progress}%)
              </div>
            )}

            {progress === 100 && (
              <div className="absolute bottom-3 left-3 bg-emerald-500/90 backdrop-blur-sm text-[10px] font-semibold text-white px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-white fill-emerald-600" />
                Read
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {safeTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {safeTags.map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
          </div>
        )}
      </div>

      {/* Footer / Interaction Bar */}
      <div className="px-4 md:px-5 py-3 bg-muted/10 border-t border-border/30 flex items-center justify-between text-muted-foreground text-xs">
        <div className="flex items-center gap-5">
          {/* Views count */}
          <span className="flex items-center gap-1.5 opacity-80" title={`${resolvedPost.viewsCount} views`}>
            <Eye className="w-4 h-4" />
            <span>{resolvedPost.viewsCount >= 1000 ? `${(resolvedPost.viewsCount / 1000).toFixed(1)}k` : resolvedPost.viewsCount}</span>
          </span>

          {/* Likes count */}
          <div onClick={(e) => e.stopPropagation()}>
            <LikeButton postId={post._id} initialLikeCount={resolvedPost.likesCount} isInitiallyLiked={likedPosts.includes(post._id)} />
          </div>

          {/* Comments count */}
          <button 
            className="flex items-center gap-1.5 hover:text-primary hover:scale-105 transition-all"
            onClick={handleCommentClick}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{resolvedPost.commentsCount}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Reading Time */}
          <ReadingTimeBadge content={resolvedPost.content} />

          {/* Bookmark */}
          <div className="rounded-full" onClick={(e) => e.stopPropagation()}>
            <BookmarkButton postId={post._id} />
          </div>

          {/* Share button */}
          <button 
            onClick={handleShare}
            className="p-1.5 rounded-full hover:bg-muted hover:text-foreground transition-all"
            title="Share Post"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Read More Link */}
          <span
            className="flex items-center gap-1 font-semibold text-primary hover:text-primary/80 transition-colors ml-1 cursor-pointer select-none"
          >
            <span>Read</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </motion.article>
  );
});
