import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { fetchFollowingThunk } from "../state/followSlice";
import { FollowCard } from "./FollowCard";
import { Loader2 } from "lucide-react";

interface FollowingListProps {
  userId: string;
}

export const FollowingList: React.FC<FollowingListProps> = ({ userId }) => {
  const dispatch = useAppDispatch();
  const { following, loading, error } = useAppSelector((state) => state.follow);

  useEffect(() => {
    dispatch(fetchFollowingThunk({ userId }));
  }, [dispatch, userId]);

  if (loading && following.length === 0) {
    return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  if (error) {
    return <div className="text-sm text-destructive">{error}</div>;
  }

  if (!following.length) {
    return <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">Not following anyone yet.</div>;
  }

  return <div className="flex flex-col gap-3">{following.map((user) => <FollowCard key={user._id} user={user} />)}</div>;
};
