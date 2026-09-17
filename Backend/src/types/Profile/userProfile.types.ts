export interface IUserProfileResponse {
  user: {
    _id: string;
    username: string;
    fullname: string;
    email: string;
    bio?: string;
    avatar?: string;
    banner?: string;
    isVerified: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    role?: string;
  };
  followersCount: number;
  followingCount: number;
  postsCount: number;
}