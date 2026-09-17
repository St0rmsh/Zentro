import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { fetchFollowersThunk } from "../state/followSlice";
import { FollowCard } from "./FollowCard";
import { Loader2 } from "lucide-react";

interface FollowersListProps {
  userId: string;
}

export const FollowersList: React.FC<FollowersListProps> = ({ userId }) => {
  const dispatch = useAppDispatch();
  const { followers, loading, error } = useAppSelector((state) => state.follow);

  useEffect(() => {
    dispatch(fetchFollowersThunk({ userId }));
  }, [dispatch, userId]);

  if (loading && followers.length === 0) {
    return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  if (error) {
    return <div className="text-sm text-destructive">{error}</div>;
  }

  if (!followers.length) {
    return <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">No followers yet.</div>;
  }

  return <div className="flex flex-col gap-3">{followers.map((user) => <FollowCard key={user._id} user={user} />)}</div>;
};
