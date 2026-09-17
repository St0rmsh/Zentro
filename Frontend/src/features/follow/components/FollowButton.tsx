import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { Button } from "@/shared/ui/button";
import { toggleFollowThunk, fetchFollowStatusThunk } from "../state/followSlice";

interface FollowButtonProps {
  userId: string;
  initialFollowing?: boolean;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export const FollowButton: React.FC<FollowButtonProps> = ({ userId, initialFollowing = false, className, size = "default" }) => {
  const dispatch = useAppDispatch();
  const relationship = useAppSelector((state) => state.follow.relationshipByUser[userId]);
  const isFollowing = relationship?.isFollowing ?? initialFollowing;
  const loading = relationship?.loading ?? false;

  React.useEffect(() => {
    if (userId && relationship === undefined) {
      dispatch(fetchFollowStatusThunk(userId));
    }
  }, [dispatch, userId, relationship]);

  const handleToggle = async () => {
    if (!userId || loading) return;
    await dispatch(toggleFollowThunk({ userId, isFollowing })).unwrap();
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type="button"
      onClick={handleToggle}
      className={className}
      aria-label={isFollowing ? "Unfollow user" : "Follow user"}
    >
      <Button size={size} variant={isFollowing ? "outline" : "default"} disabled={loading} className="min-w-[110px]">
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {isFollowing ? "Unfollowing" : "Following"}
          </span>
        ) : isFollowing ? (
          "Following"
        ) : (
          "Follow"
        )}
      </Button>
    </motion.button>
  );
};
