import { axiosInstance } from "@/shared/lib/axios";
import { FeedResponse } from "../types/feed.types";

export const feedService = {
  getFeed: async (page = 1, limit = 10, tab = "home") => {
    const response = await axiosInstance.get<FeedResponse>("/feed", {
      params: { page, limit, tab },
    });
    return response.data;
  },
  trackViewTime: async (postId: string, durationMs: number) => {
    const response = await axiosInstance.post("/view-time", { postId, durationMs });
    return response.data;
  }
};
