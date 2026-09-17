import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { FollowingList } from "../components/FollowingList";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const FollowingPage: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const { user: currentUser } = useAuth();
  const resolvedUserId = userId || String(currentUser?._id || "");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center gap-6 border-b">
        <NavLink to={userId ? `/app/profile/${userId}/followers` : "/app/profile/followers"} className="pb-3 text-2xl font-semibold text-muted-foreground hover:text-foreground">Followers</NavLink>
        <NavLink to={userId ? `/app/profile/${userId}/following` : "/app/profile/following"} className="border-b-2 border-primary pb-3 text-2xl font-semibold">Following</NavLink>
      </div>
      <FollowingList userId={resolvedUserId} />
    </div>
  );
};
