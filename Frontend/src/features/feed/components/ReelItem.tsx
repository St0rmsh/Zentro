import { useEffect, useRef, useState } from "react";
import { MessageCircle, Share2, VolumeX, Volume2 } from "lucide-react";
import { Post } from "../types/feed.types";
import { LikeButton } from "../../likes/components/LikeButton";
import { BookmarkButton } from "../../bookmarks/components/BookmarkButton";
import { ReelCommentOverlay } from "./ReelCommentOverlay";
import { feedService } from "../services/feed.service";
import { useAppSelector } from "@/shared/hooks";

interface ReelItemProps {
  post: Post;
  isActive: boolean;
}

export function ReelItem({ post, isActive }: ReelItemProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const viewStartTime = useRef<number>(0);
  const autoPlayMedia = useAppSelector((state) => state.settings.preferences.autoPlayMedia);

  // Play/pause and view tracking based on isActive
  useEffect(() => {
    if (isActive) {
      viewStartTime.current = Date.now();
      if (videoRef.current && autoPlayMedia) {
        videoRef.current.play().catch(() => console.log("Autoplay prevented"));
      }
      if (videoRef.current && !autoPlayMedia) videoRef.current.pause();
    } else {
      if (viewStartTime.current > 0) {
        const durationMs = Date.now() - viewStartTime.current;
        if (durationMs > 1000) {
          // Track view time when sliding away
          feedService.trackViewTime(post._id, durationMs).catch(console.error);
        }
        viewStartTime.current = 0;
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
    
    // Cleanup on unmount if it was active
    return () => {
      if (isActive && viewStartTime.current > 0) {
        const durationMs = Date.now() - viewStartTime.current;
        if (durationMs > 1000) {
          feedService.trackViewTime(post._id, durationMs).catch(console.error);
        }
      }
    };
  }, [autoPlayMedia, isActive, post._id]);

  const hasVideo = post.mediaType === "video" && post.mediaUrl;
  const hasImage = (post.mediaType === "image" && post.mediaUrl) || post.coverImage;

  return (
    <div className="reel-item relative w-full h-full bg-black snap-start overflow-hidden flex items-center justify-center">
      {/* Background Media */}
      {hasVideo ? (
        <video
          ref={videoRef}
          src={post.mediaUrl}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          muted={isMuted}
          playsInline
        />
      ) : hasImage ? (
        <div className="absolute inset-0 w-full h-full">
          <img
            src={post.mediaUrl || post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>
      ) : (
        /* Text-only Reel */
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/20 to-violet-900/40 flex items-center justify-center p-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight text-white line-clamp-6 drop-shadow-lg">
            {post.title}
          </h2>
        </div>
      )}

      {/* Mute Toggle for Video */}
      {hasVideo && (
        <button
          onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
          className="absolute top-6 right-6 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-20"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      )}

      {/* Right Interaction Bar */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-20">
        <div className="flex flex-col items-center gap-1">
          <LikeButton postId={post._id} className="w-12 h-12 bg-black/20 rounded-full text-white hover:bg-black/40 hover:text-primary transition-colors" />
        </div>
        
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => setShowComments(true)}
            className="w-12 h-12 flex items-center justify-center bg-black/20 rounded-full text-white hover:bg-black/40 hover:text-primary transition-colors"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
          <span className="text-white text-xs font-medium drop-shadow-md">{post.commentsCount}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <BookmarkButton postId={post._id} className="w-12 h-12 bg-black/20 rounded-full text-white hover:bg-black/40 hover:text-primary transition-colors" />
        </div>

        <div className="flex flex-col items-center gap-1">
          <button className="w-12 h-12 flex items-center justify-center bg-black/20 rounded-full text-white hover:bg-black/40 hover:text-primary transition-colors">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Bottom Info Area */}
      <div className="absolute bottom-0 left-0 right-16 p-6 flex flex-col gap-3 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-12">
        <div className="flex items-center gap-3">
          <img
            src={typeof post.user === 'object' && post.user !== null && 'profileImage' in post.user ? (post.user as { profileImage?: string }).profileImage : ''}
            alt="Author"
            className="w-10 h-10 rounded-full border-2 border-white/20 object-cover bg-primary/20"
          />
          <span className="text-white font-bold text-sm drop-shadow-md">
            @{typeof post.user === 'object' && post.user !== null && 'username' in post.user ? (post.user as { username?: string }).username : 'user'}
          </span>
        </div>
        
        {(!post.mediaType || post.mediaType !== "none") && (
          <h3 className="text-white text-lg font-medium leading-tight line-clamp-2 drop-shadow-md">
            {post.title}
          </h3>
        )}
        
        <p className="text-white/80 text-sm line-clamp-2 drop-shadow-md">
          {post.content}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2 mt-1">
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-primary-foreground/90 font-medium text-xs drop-shadow-md">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <ReelCommentOverlay
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        postId={post._id}
      />
    </div>
  );
}
