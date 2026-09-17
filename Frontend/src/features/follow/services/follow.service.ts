import { axiosInstance } from "@/shared/lib/axios";

export interface FollowUser {
  _id: string;
  username: string;
  fullname: string;
  avatar?: string;
  bio?: string;
  followerCount?: number;
  followingCount?: number;
  postsCount?: number;
}

export interface FollowStatusResponse {
  isFollowing: boolean;
}

interface FollowResponse {
  success: boolean;
  message: string;
  data: any;
}

export const followService = {
  followUser: async (userId: string): Promise<FollowResponse> => {
    const response = await axiosInstance.post<FollowResponse>(`/follow/${userId}`);
    return response.data;
  },

  unfollowUser: async (userId: string): Promise<FollowResponse> => {
    const response = await axiosInstance.post<FollowResponse>(`/follow/unfollow/${userId}`);
    return response.data;
  },

  getFollowers: async (userId: string, page = 1, limit = 10): Promise<{ users: FollowUser[]; count: number; page: number; limit: number }> => {
    const response = await axiosInstance.get(`/follow/followers/${userId}`, { params: { page, limit } });
    return {
      users: response.data.data ?? [],
      count: response.data.count ?? 0,
      page,
      limit,
    };
  },

  getFollowing: async (userId: string, page = 1, limit = 10): Promise<{ users: FollowUser[]; count: number; page: number; limit: number }> => {
    const response = await axiosInstance.get(`/follow/following/${userId}`, { params: { page, limit } });
    return {
      users: response.data.data ?? [],
      count: response.data.count ?? 0,
      page,
      limit,
    };
  },

  getFollowStatus: async (userId: string): Promise<FollowStatusResponse> => {
    const response = await axiosInstance.get<{ data: FollowStatusResponse }>(`/follow/status/${userId}`);
    return response.data.data;
  },
};
