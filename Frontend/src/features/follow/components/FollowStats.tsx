import React from "react";
import { motion } from "framer-motion";
import { useAppSelector } from "@/shared/hooks";

interface FollowStatsProps {
  followerCount?: number;
  followingCount?: number;
}

export const FollowStats: React.FC<FollowStatsProps> = ({ followerCount, followingCount }) => {
  const followState = useAppSelector((state) => state.follow);
  const followers = followerCount ?? followState.followerCount;
  const following = followingCount ?? followState.followingCount;

  return (
    <div className="flex gap-4">
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-card px-3 py-2 text-center">
        <div className="text-lg font-semibold">{followers}</div>
        <div className="text-xs text-muted-foreground">Followers</div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-card px-3 py-2 text-center">
        <div className="text-lg font-semibold">{following}</div>
        <div className="text-xs text-muted-foreground">Following</div>
      </motion.div>
    </div>
  );
};
