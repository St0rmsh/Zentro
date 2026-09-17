import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../../../shared/ui/avatar";

interface RecommendationCardProps {
  id: string;
  title: string;
  author: {
    username: string;
    fullname: string;
    avatar: string;
  };
  coverImage: string;
  readTime: string;
  date: string;
}

export const RecommendationCard = ({ id, title, author, coverImage, readTime, date }: RecommendationCardProps) => {
  return (
    <Link to={`/posts/${id}`} className="group block">
      <div className="flex flex-col h-full bg-card rounded-xl border border-border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img 
            src={coverImage} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-lg line-clamp-2 mb-3 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <div className="mt-auto flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={author.avatar} alt={author.fullname} />
              <AvatarFallback>{author.fullname.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-xs">
              <span className="font-medium text-foreground">{author.fullname}</span>
              <span className="text-muted-foreground">{date} • {readTime}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
