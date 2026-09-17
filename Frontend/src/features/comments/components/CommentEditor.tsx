import React from "react";
import { CommentInput } from "./CommentInput";
import { CommentAvatar } from "./CommentAvatar";
import { Comment } from "../types/comment.types";
import { motion } from "framer-motion";

interface CommentEditorProps {
  comment: Comment;
  isUpdating: boolean;
  onSave: (content: string) => Promise<void>;
  onCancel: () => void;
}

/**
 * Inline editing wrapper that shows the CommentInput pre-filled
 * with the existing comment content, alongside the user's avatar.
 */
export const CommentEditor: React.FC<CommentEditorProps> = React.memo(
  ({ comment, isUpdating, onSave, onCancel }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex gap-4 p-4 border-b border-border/40 bg-muted/30"
    >
      <CommentAvatar
        src={comment.user.avatar}
        alt={comment.user.username}
        fallback={comment.user.fullname.charAt(0)}
      />
      <div className="flex-1 w-full">
        <CommentInput
          initialValue={comment.content}
          onSubmit={onSave}
          isLoading={isUpdating}
          onCancel={onCancel}
          autoFocus
          placeholder="Edit your comment..."
        />
      </div>
    </motion.div>
  ),
);

CommentEditor.displayName = "CommentEditor";
