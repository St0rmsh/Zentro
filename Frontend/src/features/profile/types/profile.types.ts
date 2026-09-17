export interface ProfileStats {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  bookmarksCount?: number;
  likesReceivedCount?: number;
  readingStreak?: number;
}

export interface ProfileUser {
  id: string;
  username: string;
  fullname: string;
  email: string;
  avatar?: string;
  banner?: string;
  bio?: string;
  role: "user" | "admin" | "moderator";
  isVerified: boolean;
  isEmailVerified?: boolean;
  followerCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsItem {
  id: string;
  label: string;
  description: string;
  value?: string | boolean;
  type: "text" | "toggle" | "select";
}

export interface PasswordChangeData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
