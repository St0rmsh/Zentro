import { PostAuthor } from "../types/post.types";
import { Avatar, AvatarFallback, AvatarImage } from "../../../shared/ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "../../../shared/ui/button";

interface AuthorCardProps {
  author: PostAuthor;
}

export const AuthorCard = ({ author }: AuthorCardProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-card p-6 rounded-2xl border border-border shadow-sm">
      <Link to={`/app/profile/${author.username}`} className="shrink-0">
        <Avatar className="h-20 w-20 border border-border/50">
          <AvatarImage src={author.avatar} alt={author.fullname} />
          <AvatarFallback className="text-xl">{author.fullname.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </Link>
      
      <div className="flex flex-col items-center sm:items-start flex-1 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4 mb-2">
          <div>
            <Link 
              to={`/app/profile/${author.username}`}
              className="text-xl font-bold hover:text-primary transition-colors"
            >
              {author.fullname}
            </Link>
            <p className="text-sm text-muted-foreground">@{author.username}</p>
          </div>
          
          <Button variant="outline" className="rounded-full" size="sm">
            Follow
          </Button>
        </div>
        
        {author.bio ? (
          <p className="text-sm text-foreground/80 mt-2 line-clamp-3">
            {author.bio}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground mt-2 italic">
            This author hasn't added a bio yet.
          </p>
        )}
        
        <div className="flex gap-4 mt-4 text-xs font-medium text-muted-foreground">
          <span><strong className="text-foreground">24</strong> Posts</span>
          <span><strong className="text-foreground">1.2k</strong> Followers</span>
        </div>
      </div>
    </div>
  );
};
