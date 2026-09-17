import React from "react";
import { formatDistanceToNow } from "date-fns";

interface CommentTimestampProps {
  createdAt: string;
  updatedAt?: string;
}

/**
 * Renders a human-readable relative timestamp with a full-date tooltip.
 * Shows "(edited)" badge when the comment has been updated.
 */
export const CommentTimestamp: React.FC<CommentTimestampProps> = React.memo(
  ({ createdAt, updatedAt }) => {
    const isEdited = updatedAt && updatedAt !== createdAt;

    return (
      <span className="inline-flex items-center gap-1.5">
        <time
          dateTime={createdAt}
          title={new Date(createdAt).toLocaleString()}
          className="text-muted-foreground text-xs cursor-default"
        >
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </time>
        {isEdited && (
          <span
            className="text-muted-foreground text-xs italic"
            title={`Edited ${new Date(updatedAt).toLocaleString()}`}
          >
            (edited)
          </span>
        )}
      </span>
    );
  },
);

CommentTimestamp.displayName = "CommentTimestamp";
