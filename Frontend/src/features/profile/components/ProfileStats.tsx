import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

interface ProfileStats {
  posts: number;
  followers: number;
  following: number;
  bookmarks?: number;
}

interface ProfileStatsProps {
  stats: ProfileStats;
  className?: string;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ stats, className, onFollowersClick, onFollowingClick }) => {
  const statItems = [
    { label: "Posts", value: stats.posts, onClick: undefined },
    { label: "Followers", value: stats.followers, onClick: onFollowersClick },
    { label: "Following", value: stats.following, onClick: onFollowingClick },
    ...(stats.bookmarks !== undefined ? [{ label: "Bookmarks", value: stats.bookmarks, onClick: undefined }] : []),
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("grid grid-cols-3 md:grid-cols-4 gap-4", className)}
    >
      {statItems.map((stat) => (
        <motion.button
          key={stat.label}
          variants={itemVariants}
          type="button"
          onClick={stat.onClick}
          className="flex flex-col items-center justify-center p-3 rounded-lg bg-card border hover:border-primary/40 transition-colors"
        >
          <div className="text-lg md:text-2xl font-bold">{stat.value.toLocaleString()}</div>
          <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
        </motion.button>
      ))}
    </motion.div>
  );
};
