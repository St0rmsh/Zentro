import { axiosInstance } from "@/shared/lib/axios";

interface LikeResponse {
  message: string;
  success: boolean;
  data: {
    message: string;
    liked: boolean;
  };
}

export const likeService = {
  /**
   * Toggle like on a post.
   * POST /api/like/:postId
   */
  toggleLike: async (postId: string): Promise<LikeResponse> => {
    const response = await axiosInstance.post<LikeResponse>(`/like/${postId}`);
    return response.data;
  },
};
