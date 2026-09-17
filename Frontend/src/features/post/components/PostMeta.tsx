import { PostDetail } from "../types/post.types";
import { Avatar, AvatarFallback, AvatarImage } from "../../../shared/ui/avatar";
import { Link } from "react-router-dom";
import { Clock, Eye } from "lucide-react";

interface PostMetaProps {
  post: PostDetail;
}

export const PostMeta = ({ post }: PostMetaProps) => {
  // Simple word count to reading time logic (approx 200 words per min)
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="flex items-center gap-4 text-sm">
      <Link to={`/app/profile/${post.user.username}`}>
        <Avatar className="h-12 w-12 border border-border/50 shadow-sm transition-transform hover:scale-105">
          <AvatarImage src={post.user.avatar} alt={post.user.fullname} />
          <AvatarFallback>{post.user.fullname.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </Link>
      
      <div className="flex flex-col">
        <Link 
          to={`/app/profile/${post.user.username}`}
          className="font-semibold text-foreground hover:text-primary transition-colors hover:underline"
        >
          {post.user.fullname}
        </Link>
        <div className="flex items-center text-muted-foreground flex-wrap gap-x-2 gap-y-1 mt-0.5">
          <span>{new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(post.createdAt))}</span>
          <span className="hidden sm:inline text-muted-foreground/40">•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {readingTime} min read
          </span>
          <span className="hidden sm:inline text-muted-foreground/40">•</span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {post.viewsCount.toLocaleString()} views
          </span>
        </div>
      </div>
    </div>
  );
};
