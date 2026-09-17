import { useEffect, useState } from "react";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { profileService } from "@/features/auth/services/profile.service";
import type { ProfileUser } from "../types/profile.types";

export const useProfile = (userId?: string, username?: string) => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [profile, setProfile] = useState<(ProfileUser & { followersCount: number; followingCount: number; postsCount: number }) | null>(null);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId && !username) {
      setProfile(null);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    const request = userId ? profileService.getProfile(userId) : profileService.getProfileByUsername(username!);
    request
      .then((result) => {
        if (active && result) setProfile({ ...result.user as unknown as ProfileUser, followersCount: result.followersCount, followingCount: result.followingCount, postsCount: result.postsCount });
      })
      .catch(() => { if (active) setError("Unable to load profile"); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [userId, username]);

  return {
    profile: profile || currentUser,
    loading,
    error,
  };
};
