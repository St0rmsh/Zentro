import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { FollowButton } from "./FollowButton";
import { FollowUser } from "../services/follow.service";

interface FollowCardProps {
  user: FollowUser;
}

export const FollowCard: React.FC<FollowCardProps> = ({ user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between rounded-2xl border border-border/50 bg-card p-4"
    >
      <Link to={`/app/profile/${user.username}`} className="flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <Avatar className="h-12 w-12 shrink-0">
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback>{user.fullname?.charAt(0) ?? "U"}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="truncate font-semibold">{user.fullname}</div>
          <div className="truncate text-sm text-muted-foreground">@{user.username}</div>
          {user.bio ? <div className="truncate text-sm text-muted-foreground">{user.bio}</div> : null}
        </div>
      </Link>
      <FollowButton userId={user._id} />
    </motion.div>
  );
};
