import React from "react";
import {
  MoreHorizontal,
  Edit2,
  Trash2,
  Link as LinkIcon,
  Flag,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/shared/ui/dropdown-menu";
import { toast } from "sonner";

interface CommentActionsProps {
  commentId: string;
  isAuthor: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Extracted dropdown menu with comment actions.
 * Shows Edit & Delete for the author, Copy Link & Report for everyone.
 *
 * Future-ready slots: Reply, Pin, Like Comment.
 */
export const CommentActions: React.FC<CommentActionsProps> = React.memo(
  ({ commentId, isAuthor, onEdit, onDelete }) => {
    const handleCopyLink = () => {
      const url = `${window.location.origin}${window.location.pathname}#comment-${commentId}`;
      navigator.clipboard.writeText(url).then(() => {
        toast.success("Link copied to clipboard");
      });
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
            aria-label="Comment actions"
          >
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Comment actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[160px]">
          {isAuthor && (
            <>
              <DropdownMenuItem onClick={onEdit}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={handleCopyLink}>
            <LinkIcon className="h-4 w-4 mr-2" />
            Copy Link
          </DropdownMenuItem>
          {!isAuthor && (
            <DropdownMenuItem>
              <Flag className="h-4 w-4 mr-2" />
              Report
            </DropdownMenuItem>
          )}
          {/* Future: Reply, Pin, Like Comment */}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
);

CommentActions.displayName = "CommentActions";
