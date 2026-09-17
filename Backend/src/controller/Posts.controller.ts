import type { Request, Response } from "express";
import type { ICreatePostBody, IPostUpdateBody, ISearchQuery } from "../types/Posts/posts.types.js";
import { createPostService, deletePostService, getAllPostsService, getSinglePostService, getUserPostsService, searchPostService, updatePostService } from "../services/Posts.service.js";
import { uploadBuffer } from "../config/storage.js";
import mongoose from "mongoose";
import { moderateContent } from "../services/ai-moderation.service.js";
import { generatePostSummary } from "../services/ai-summarizer.service.js";
import PostModel from "../model/post.model.js";


export const createPostController = async (req: Request, res: Response) => {


    try {

        const userId = req.user?._id
        const { title, content, category } = req.body as ICreatePostBody
        const rawTags = req.body.tags;
        const tags = Array.isArray(rawTags)
            ? rawTags
            : rawTags && typeof rawTags === "object"
                ? Object.values(rawTags)
                : rawTags ? [rawTags] : undefined;
        const isPublished = req.body.isPublished === undefined
            ? undefined
            : req.body.isPublished === true || req.body.isPublished === "true";

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            })
        }

        const moderationResult = await moderateContent(`${title} ${content}`);
        if (!moderationResult.isSafe) {
            return res.status(400).json({
                success: false,
                message: `Content violates community guidelines: ${moderationResult.reason}`
            });
        }

        const files = req.files as { coverImage?: Express.Multer.File[]; media?: Express.Multer.File[] } | undefined;
        let coverImage: string | undefined
        let mediaUrl: string | undefined
        let mediaType: "image" | "video" | undefined
        if (files?.coverImage?.[0]) {
            const uploadImage = await uploadBuffer({
                buffer: files.coverImage[0].buffer,
                fileName: files.coverImage[0].originalname,
                folder: "Zentro/posts"
            })

            coverImage = uploadImage.url
        }
        if (files?.media?.[0]) {
            const media = files.media[0];
            const uploadMedia = await uploadBuffer({ buffer: media.buffer, fileName: media.originalname, folder: "Zentro/posts/media" });
            mediaUrl = uploadMedia.url;
            mediaType = media.mimetype.startsWith("video/") ? "video" : "image";
        }

        const postData: ICreatePostBody = {
            title, content,
            ...(tags && { tags }),
            ...(category && { category }),
            ...(coverImage && { coverImage }),
            ...(mediaUrl ? { mediaUrl, mediaType: mediaType! } : {}),
            ...(isPublished !== undefined && { isPublished }),
        };

        const posts = await createPostService(userId, postData)

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: posts
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error"
        });
    }
}


export const getALLPostsController = async (req: Request, res: Response) => {

    try {

        const userId = req.user?._id
        const { page, limit } = req.query

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const result = await getAllPostsService(userId, {
            page: Number(page) || 1,
            limit: Number(limit) || 10
        })

        return res.status(200).json({
            success: true,
            message: "Posts fetched successfully",
            ...result
        })



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error"
        })
    }
}



export const getUserPostsController = async (req: Request<{ userId: string }>, res: Response) => {
    try {
        const { userId } = req.params
        const { page, limit } = req.query

        if (!userId) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const result = await getUserPostsService(userId, {
            page: Number(page) || 1,
            limit: Number(limit) || 10
        })

        return res.status(200).json({
            success: true,
            message: "Posts fetched successfully",
            ...result
        })



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error"
        })
    }
}



export const getSinglePostController = async (req: Request<{ postId: string }>, res: Response) => {
    try {
        const { postId } = req.params

        if (!postId) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID format",
            });
        }

        const post = await getSinglePostService(postId)

        return res.status(200).json({
            success: true,
            message: "Post fetched successfully",
            data: post
        })



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error"
        })
    }
}



export const updatePostController = async (req: Request<{ postId: string }>, res: Response) => {
    try {

        const userId = req.user?._id
        const { postId } = req.params

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        if (!postId) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID format",
            });
        }

        const { title, content, tags, category, isPublished } = req.body as IPostUpdateBody

        let coverImage: string | undefined;

        if (req.file) {
            const uploadImage = await uploadBuffer({
                buffer: req.file.buffer,
                fileName: req.file.originalname,
                folder: "Zentro/posts"
            })
            coverImage = uploadImage.url
        }

        const updatedData: IPostUpdateBody = {
            ...(title && { title }),
            ...(content && { content }),
            ...(tags && { tags }),
            ...(category && { category }),
            ...(isPublished && { isPublished }),
            ...(coverImage && { coverImage }),
        }

        const updatePost = await updatePostService(postId, userId, updatedData)

        return res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: updatePost
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error"
        })
    }
}


export const deletePostController = async (req: Request<{ postId: string }>, res: Response) => {
    try {
        const userId = req.user?._id
        const { postId } = req.params

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        if (!postId) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID format",
            });
        }

        const deletePost = await deletePostService(postId, userId)

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully",
            data: deletePost
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error"
        })
    }
}



export const searchPostController = async (req: Request<{}, {}, {}, ISearchQuery>, res: Response) => {
    try {
        const { q, page, limit, category, tag } = req.query

        const searchQuery = typeof q === "string"
            ? q.trim()
            : "";

        const result = await searchPostService(searchQuery, {
            page: Math.max(1, Number(page) || 1),
            limit: Math.min(50, Math.max(1, Number(limit) || 10)),
            ...(typeof category === "string" && { category }),
            ...(typeof tag === "string" && { tag }),
        });

        return res.status(200).json({
            success: true,
            message:
                result.posts.length > 0
                    ? "Posts fetched successfully"
                    : "No posts found",
            ...result
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error"
        })
    }
}

export const summaryPostController = async (req: Request<{ postId: string }>, res: Response) => {
    try {
        const { postId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ success: false, message: "Invalid post ID format" });
        }

        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        if (post.summary) {
            return res.status(200).json({ success: true, summary: post.summary });
        }

        const summary = await generatePostSummary(post.content);
        post.summary = summary;
        await post.save();

        return res.status(200).json({ success: true, summary });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to generate summary"
        });
    }
}