import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

interface CommentAvatarProps {
  src?: string;
  alt: string;
  fallback: string;
  className?: string;
}

/**
 * Reusable comment avatar component.
 * Wraps the shared Avatar with comment-specific defaults.
 */
export const CommentAvatar: React.FC<CommentAvatarProps> = React.memo(
  ({ src, alt, fallback, className = "h-10 w-10 shrink-0" }) => (
    <Avatar className={className}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  ),
);

CommentAvatar.displayName = "CommentAvatar";
