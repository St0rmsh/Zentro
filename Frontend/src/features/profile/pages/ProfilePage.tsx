import React, { useEffect } from "react";
import { SEO } from "@/shared/components/SEO";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useProfile } from "../hooks";
import {
  ProfileBanner,
  ProfileAvatar,
  ProfileInfo,
  ProfileStats,
  ProfileActions,
  ProfileSkeleton,
  BioSection,
  ProfileCard,
} from "../components";
import { ProfileUser } from "../types/profile.types";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { fetchFollowStatusThunk } from "@/features/follow/state/followSlice";
import { ReadingStatsTab } from "@/features/reading/components/ReadingStatsTab";
import { useState } from "react";
import { axiosInstance } from "@/shared/lib/axios";
import { FeedCard } from "@/features/feed/components/FeedCard";
import type { Post } from "@/features/feed/types/feed.types";

type ProfileParams = {
  username?: string;
} & Record<string, string | undefined>;

interface ProfilePageProps {
  isOwnProfile?: boolean;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ isOwnProfile: isOwnProfileProp = false }) => {
  const { username } = useParams<ProfileParams>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAuth();
  const profileUserId = username && username !== currentUser?.username ? undefined : currentUser?._id;
  const { profile, loading } = useProfile(profileUserId, !isOwnProfileProp && username !== currentUser?.username ? username : undefined);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [bookmarksCount, setBookmarksCount] = useState<number | undefined>(undefined);

  const [activeTab, setActiveTab] = useState<'posts' | 'stats'>('posts');

  // Determine if viewing own profile
  const isOwnProfile = isOwnProfileProp || !username || username === currentUser?.username;
  const displayUser = isOwnProfile ? (profile || currentUser) : profile;
  const targetUser = displayUser || null;
  const targetUserId = String((targetUser as any)?._id ?? (targetUser as any)?.id ?? "");
  const relationship = useAppSelector((state) => state.follow.relationshipByUser[String(targetUserId)]);
  const isFollowing = relationship?.isFollowing ?? false;

  useEffect(() => {
    if (!isOwnProfile && targetUserId) {
      dispatch(fetchFollowStatusThunk(targetUserId));
    }
  }, [dispatch, isOwnProfile, targetUserId]);

  useEffect(() => {
    if (!targetUserId) return;
    let active = true;
    setPostsLoading(true);
    axiosInstance.get(`/post/user/${targetUserId}`, { params: { page: 1, limit: 20 } })
      .then((response) => { if (active) setPosts(response.data.posts ?? []); })
      .catch(() => { if (active) setPosts([]); })
      .finally(() => { if (active) setPostsLoading(false); });
    return () => { active = false; };
  }, [targetUserId]);

  // Bookmarks are private to the owner, so only fetch this on your own profile.
  useEffect(() => {
    if (!isOwnProfile) {
      setBookmarksCount(undefined);
      return;
    }
    let active = true;
    axiosInstance.get("/bookmark", { params: { page: 1, limit: 1 } })
      .then((response) => { if (active) setBookmarksCount(response.data.totalBookmarks ?? 0); })
      .catch(() => { if (active) setBookmarksCount(0); });
    return () => { active = false; };
  }, [isOwnProfile]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <ProfileSkeleton />
      </div>
    );
  }

  if (!targetUser && !isOwnProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Profile not found</h1>
          <p className="text-muted-foreground mt-2">The user you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const user = targetUser;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const stats = {
    posts: (user as any).postsCount || 0,
    followers: (user as any).followersCount || (user as any).followerCount || 0,
    following: (user as any).followingCount || 0,
    bookmarks: isOwnProfile ? bookmarksCount : undefined,
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen py-8"
    >
      <SEO 
        title={`Zentro — ${(user as any).fullname || (user as any).username}'s Profile`}
        description={(user as any).bio || `Check out ${(user as any).username}'s profile on Zentro.`}
        image={(user as any).avatar}
        type="profile"
      />
      {/* Profile Card */}
      <div className="max-w-4xl mx-auto px-4">
        <ProfileCard>
          {/* Banner */}
          <ProfileBanner bannerUrl={(user as any).banner} />

          {/* Content */}
          <div className="px-6 md:px-10 pb-8">
            {/* Avatar and Actions */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-12 mb-6 gap-4">
              <ProfileAvatar avatarUrl={user.avatar} fullname={user.fullname} />
              <ProfileActions
                isOwnProfile={isOwnProfile}
                isFollowing={isFollowing}
                targetUserId={targetUserId}
                targetUsername={user.username}
                onMessageClick={() => navigate(`/messages?recipient=${encodeURIComponent(targetUserId)}`)}
              />
            </div>

            {/* Info */}
            <ProfileInfo user={user as unknown as ProfileUser} />

            {/* Bio */}
            <BioSection bio={user.bio} />

            {/* Stats */}
            <div className="mt-8 pt-6 border-t">
              <ProfileStats
                stats={stats}
                onFollowersClick={() => targetUserId && navigate(`/app/profile/${targetUserId}/followers`)}
                onFollowingClick={() => targetUserId && navigate(`/app/profile/${targetUserId}/following`)}
              />
            </div>
          </div>
        </ProfileCard>

        {/* Tabs for Own Profile */}
        {isOwnProfile && (
          <div className="mt-8 flex items-center justify-center gap-8 border-b border-border/50 pb-px">
            <button
              onClick={() => setActiveTab('posts')}
              className={`pb-4 text-sm font-semibold transition-colors relative ${
                activeTab === 'posts' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Posts
              {activeTab === 'posts' && (
                <motion.div layoutId="profile-tab-indicator" className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`pb-4 text-sm font-semibold transition-colors relative ${
                activeTab === 'stats' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Reading Stats
              {activeTab === 'stats' && (
                <motion.div layoutId="profile-tab-indicator" className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
              )}
            </button>
          </div>
        )}

        {/* Content Section */}
        <div className="mt-8">
          {(!isOwnProfile || activeTab === 'posts') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {postsLoading ? <p className="py-8 text-center text-muted-foreground">Loading posts...</p> : posts.length > 0 ? posts.map((post, index) => <FeedCard key={post._id} post={post} index={index} />) : <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">No posts yet.</p>}
            </motion.div>
          )}

          {isOwnProfile && activeTab === 'stats' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ReadingStatsTab />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};