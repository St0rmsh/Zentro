import { axiosInstance } from "@/shared/lib/axios";
import { ProfileFormData } from "../schemas/profile.schema";
import { ApiResponse } from "@/shared/types/api.types";
import { User } from "@/shared/types/user.types";

export interface ProfileResponse {
  user: User;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

export const profileService = {
  getProfile: async (userId: string) => {
    const response = await axiosInstance.get<ApiResponse<ProfileResponse>>(`/profile/${userId}`);
    return response.data.data;
  },

  getProfileByUsername: async (username: string) => {
    const response = await axiosInstance.get<ApiResponse<ProfileResponse>>(`/profile/username/${encodeURIComponent(username)}`);
    return response.data.data;
  },

  updateProfile: async (data: ProfileFormData, avatarFile?: File, bannerFile?: File) => {
    const formData = new FormData();
    
    // Append text data
    if (data.username) formData.append("username", data.username);
    if (data.fullname) formData.append("fullname", data.fullname);
    if (data.bio) formData.append("bio", data.bio);

    // Append file data with the field names required by multer
    if (avatarFile) formData.append("avatar", avatarFile);
    if (bannerFile) formData.append("banner", bannerFile);

    const response = await axiosInstance.patch<ApiResponse<User>>("/auth/update-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};
