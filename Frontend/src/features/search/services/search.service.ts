import { axiosInstance } from "@/shared/lib/axios";
import type {
  SearchOverviewResponse,
  SearchPostsResponse,
  SearchUsersResponse,
  SearchTagsResponse,
  DiscoverResponse
} from "../types";

export const searchService = {
  getSearchOverview: async (query: string, page = 1, limit = 5): Promise<SearchOverviewResponse> => {
    const response = await axiosInstance.get("/search", {
      params: { q: query, page, limit }
    });
    return response.data;
  },

  searchPosts: async (query: string, page = 1, limit = 10): Promise<SearchPostsResponse> => {
    const response = await axiosInstance.get("/search/posts", {
      params: { q: query, page, limit }
    });
    return response.data;
  },

  searchUsers: async (query: string, page = 1, limit = 10): Promise<SearchUsersResponse> => {
    const response = await axiosInstance.get("/search/users", {
      params: { q: query, page, limit }
    });
    return response.data;
  },

  searchTags: async (query: string): Promise<SearchTagsResponse> => {
    const response = await axiosInstance.get("/search/tags", {
      params: { q: query }
    });
    return response.data;
  },

  getDiscoverData: async (): Promise<DiscoverResponse> => {
    const response = await axiosInstance.get("/search/discover");
    return response.data;
  }
};
