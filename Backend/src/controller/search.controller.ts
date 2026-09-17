import type { Request, Response } from "express";
import type { ISearchQuery } from "../types/Posts/posts.types.js";
import { searchService } from "../services/search.service.js";

export const searchController = async (req: Request<{}, {}, {}, ISearchQuery>, res: Response) => {
  try {
    const { q = "", page = 1, limit = 10 } = req.query;
    const searchQuery = typeof q === "string" ? q.trim() : "";
    const currentPage = Math.max(1, Number(page) || 1);
    const currentLimit = Math.min(50, Math.max(1, Number(limit) || 10));

    const [postsResult, usersResult, tagsResult] = await Promise.all([
      searchService.searchPosts(searchQuery, currentPage, currentLimit),
      searchService.searchUsers(searchQuery, currentPage, currentLimit),
      searchService.searchTags(searchQuery, 20),
    ]);

    return res.status(200).json({
      success: true,
      message: searchQuery ? `Search results for ${searchQuery}` : "Search overview",
      query: searchQuery,
      posts: postsResult.posts,
      users: usersResult.users,
      tags: tagsResult.tags,
      postPagination: {
        currentPage: postsResult.currentPage,
        totalPages: postsResult.totalPages,
        limit: postsResult.limit,
        hasNextPage: postsResult.hasNextPage,
      },
      userPagination: {
        currentPage: usersResult.currentPage,
        totalPages: usersResult.totalPages,
        limit: usersResult.limit,
        hasNextPage: usersResult.hasNextPage,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const searchPostsController = async (req: Request<{}, {}, {}, ISearchQuery>, res: Response) => {
  try {
    const { q = "", page = 1, limit = 10 } = req.query;
    const searchQuery = typeof q === "string" ? q.trim() : "";
    const postsResult = await searchService.searchPosts(
      searchQuery,
      Math.max(1, Number(page) || 1),
      Math.min(50, Math.max(1, Number(limit) || 10))
    );

    return res.status(200).json({
      success: true,
      message: postsResult.posts.length > 0 ? "Posts fetched successfully" : "No posts found",
      ...postsResult,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const searchUsersController = async (req: Request<{}, {}, {}, ISearchQuery>, res: Response) => {
  try {
    const { q = "", page = 1, limit = 10 } = req.query;
    const searchQuery = typeof q === "string" ? q.trim() : "";
    const usersResult = await searchService.searchUsers(
      searchQuery,
      Math.max(1, Number(page) || 1),
      Math.min(50, Math.max(1, Number(limit) || 10))
    );

    return res.status(200).json({
      success: true,
      message: usersResult.users.length > 0 ? "Users fetched successfully" : "No users found",
      ...usersResult,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const searchTagsController = async (req: Request<{}, {}, {}, ISearchQuery>, res: Response) => {
  try {
    const { q = "" } = req.query;
    const searchQuery = typeof q === "string" ? q.trim() : "";
    const tagsResult = await searchService.searchTags(searchQuery, 20);

    return res.status(200).json({
      success: true,
      message: tagsResult.tags.length > 0 ? "Tags fetched successfully" : "No tags found",
      ...tagsResult,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const discoverController = async (_req: Request, res: Response) => {
  try {
    const discoverData = await searchService.getDiscover();
    return res.status(200).json({
      success: true,
      message: "Discover data fetched successfully",
      ...discoverData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};
