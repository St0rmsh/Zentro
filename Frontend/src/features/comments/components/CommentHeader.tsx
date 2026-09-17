import React from "react";
import { CommentUser } from "../types/comment.types";
import { CommentTimestamp } from "./CommentTimestamp";

interface CommentHeaderProps {
  user: CommentUser;
  createdAt: string;
  updatedAt: string;
}

/**
 * Displays the comment author's name, username, and timestamp.
 */
export const CommentHeader: React.FC<CommentHeaderProps> = React.memo(
  ({ user, createdAt, updatedAt }) => (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="font-semibold text-sm text-foreground">
        {user.fullname}
      </span>
      <span className="text-muted-foreground text-sm">@{user.username}</span>
      <span className="text-muted-foreground text-xs" aria-hidden="true">
        •
      </span>
      <CommentTimestamp createdAt={createdAt} updatedAt={updatedAt} />
    </div>
  ),
);

CommentHeader.displayName = "CommentHeader";
