import { axiosInstance } from "@/shared/lib/axios";

export interface CreatePostPayload {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  coverImage?: string;
  isPublished?: boolean;
}

export interface UpdatePostPayload {
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
  coverImage?: string;
  isPublished?: boolean;
}

export const postEditorService = {
  createPost: async (payload: CreatePostPayload | FormData) => {
    const response = await axiosInstance.post("/post/create", payload, {
      // Let the browser add the multipart boundary.
      headers: undefined
    });
    return response.data;
  },

  updatePost: async (postId: string, payload: UpdatePostPayload | FormData) => {
    const response = await axiosInstance.patch(`/post/${postId}`, payload, {
      headers: undefined
    });
    return response.data;
  },

  getPostForEdit: async (postId: string) => {
    const response = await axiosInstance.get(`/post/${postId}`);
    return response.data;
  },

  deletePost: async (postId: string) => {
    const response = await axiosInstance.delete(`/post/${postId}`);
    return response.data;
  }
};
