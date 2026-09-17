import { Button } from "../../../shared/ui/button";
import { MessageSquare, Share2, Link as LinkIcon, Flag } from "lucide-react";
import { cn } from "../../../shared/lib/utils";
import { LikeButton } from "../../likes/components/LikeButton";
import { BookmarkButton } from "../../bookmarks/components/BookmarkButton";

interface InteractionBarProps {
  orientation?: "vertical" | "horizontal";
  postId?: string;
  initialLikes?: number;
}

export const InteractionBar = ({ orientation = "vertical", postId, initialLikes = 0 }: InteractionBarProps) => {
  const isVertical = orientation === "vertical";
  
  return (
    <div className={cn(
      "flex items-center gap-4",
      isVertical ? "flex-col py-6 px-3 bg-background/50 rounded-full border border-border/40" : "flex-row w-full justify-around max-w-sm"
    )}>
      {postId ? (
        <div className="flex flex-col items-center gap-1 group">
          <LikeButton postId={postId} initialLikeCount={initialLikes} />
        </div>
      ) : null}

      <div className="flex flex-col items-center gap-1 group">
        <Button variant="ghost" size="icon" className="rounded-full hover:text-blue-500 hover:bg-blue-500/10">
          <MessageSquare className="w-5 h-5" />
        </Button>
        <span className="text-xs text-muted-foreground font-medium">Comment</span>
      </div>

      {postId ? (
        <div className="flex flex-col items-center gap-1 group">
          <BookmarkButton postId={postId} />
        </div>
      ) : null}

      {isVertical && <div className="w-8 h-px bg-border/60 my-2" />}
      {!isVertical && <div className="w-px h-8 bg-border/60 mx-2" />}

      <div className="flex flex-col items-center gap-1 group">
        <Button variant="ghost" size="icon" className="rounded-full hover:text-green-500 hover:bg-green-500/10">
          <Share2 className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex flex-col items-center gap-1 group">
        <Button variant="ghost" size="icon" className="rounded-full hover:text-orange-500 hover:bg-orange-500/10">
          <LinkIcon className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex flex-col items-center gap-1 group">
        <Button variant="ghost" size="icon" className="rounded-full hover:text-yellow-500 hover:bg-yellow-500/10">
          <Flag className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
