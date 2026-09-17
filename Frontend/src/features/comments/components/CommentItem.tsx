import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Edit2, Trash2, Link as LinkIcon, Flag } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/shared/ui/dropdown-menu";
import { Comment } from "../types/comment.types";
import { CommentInput } from "./CommentInput";
import { motion } from "framer-motion";

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  onEdit: (commentId: string, content: string) => Promise<void>;
  onDelete: (commentId: string) => void;
  isEditing?: boolean;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  onEdit,
  onDelete,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const isAuthor = currentUserId === comment.user._id;

  const handleCopyLink = () => {
    // In a real app, this might generate a deep link to the specific comment
    navigator.clipboard.writeText(window.location.href);
  };

  const handleEditSubmit = async (content: string) => {
    try {
      setIsUpdating(true);
      await onEdit(comment._id, content);
      setIsEditMode(false);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isEditMode) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-4 p-4 border-b border-border/40 bg-muted/30"
      >
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={comment.user.avatar} alt={comment.user.username} />
          <AvatarFallback>{comment.user.fullname.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 w-full">
          <CommentInput
            initialValue={comment.content}
            onSubmit={handleEditSubmit}
            isLoading={isUpdating}
            onCancel={() => setIsEditMode(false)}
            autoFocus
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex gap-4 p-5 sm:p-6 border-b border-border/40 hover:bg-muted/30 transition-colors group rounded-xl"
    >
      <Avatar className="h-12 w-12 shrink-0 border border-border/50 shadow-sm">
        <AvatarImage src={comment.user.avatar} alt={comment.user.username} />
        <AvatarFallback className="bg-primary/10 text-primary font-semibold">{comment.user.fullname.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 pt-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-foreground">{comment.user.fullname}</span>
            <span className="text-muted-foreground text-sm font-medium">@{comment.user.username}</span>
            <span className="text-muted-foreground text-xs">•</span>
            <span className="text-muted-foreground text-xs hover:underline cursor-pointer" title={new Date(comment.createdAt).toLocaleString()}>
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
            {comment.updatedAt !== comment.createdAt && (
              <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold ml-1 bg-muted px-1.5 py-0.5 rounded-sm">(edited)</span>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity rounded-full hover:bg-muted"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Comment actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl shadow-lg border-border/50">
              {isAuthor && (
                <>
                  <DropdownMenuItem onClick={() => setIsEditMode(true)} className="cursor-pointer">
                    <Edit2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(comment._id)}
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
                <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                Copy Link
              </DropdownMenuItem>
              {!isAuthor && (
                <DropdownMenuItem className="cursor-pointer">
                  <Flag className="h-4 w-4 mr-2 text-muted-foreground" />
                  Report
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="text-[15px] whitespace-pre-wrap break-words leading-relaxed text-foreground/90">
          {comment.content}
        </div>
        
        {/* Future placeholder for interactions like Reply, Like */}
      </div>
    </motion.div>
  );
};
