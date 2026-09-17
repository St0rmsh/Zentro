import { motion } from "framer-motion";
import { RecommendedUser } from "../types";
import { UserPlus } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface RecommendedAuthorProps {
  user: RecommendedUser;
}

export const RecommendedAuthor = ({ user }: RecommendedAuthorProps) => {
  return (
    <motion.div 
      whileHover={{ x: 4 }}
      className="flex items-start justify-between gap-4 py-3 group cursor-pointer"
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center font-bold text-primary">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
            @{user.username}
          </h4>
          <p className="text-xs text-muted-foreground line-clamp-1 mb-1">
            {user.bio}
          </p>
          {user.mutualInterests && user.mutualInterests.length > 0 && (
            <p className="text-[10px] text-muted-foreground/80">
              Interest: {user.mutualInterests.join(', ')}
            </p>
          )}
        </div>
      </div>
      <Button variant="outline" size="sm" className="rounded-full flex-shrink-0 h-8 px-3">
        <UserPlus className="w-3 h-3 mr-1.5" />
        Follow
      </Button>
    </motion.div>
  );
};
