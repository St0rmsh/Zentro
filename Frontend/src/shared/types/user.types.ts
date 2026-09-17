export interface User {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  avatar?: string;
  banner?: string;
  bio?: string;
  likedPosts?: string[];
  bookmarkedPosts?: string[];
  role?: "admin" | "user" | string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
