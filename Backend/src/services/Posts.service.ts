import PostModel from "../model/post.model.js";
import type { ICreatePostBody, IPost, IPostUpdateBody } from "../types/Posts/posts.types.js";
import { escapeRegex } from "../utils/escapeRegex.js";
import { notifyMentionedUsersService } from "./notification.service.js";


export const createPostService = async (userId: string, { title, content, tags, category, coverImage, mediaUrl, mediaType, isPublished }: ICreatePostBody) => {
    try {


        const post = await PostModel.create({
            user: userId,
            title,
            content,
            ...(tags && { tags }),
            ...(category && { category }),
            ...(coverImage && { coverImage }),
            ...(mediaUrl && { mediaUrl }),
            ...(mediaType && { mediaType }),
            ...(isPublished !== undefined && { isPublished }),
        });


        await notifyMentionedUsersService(`${title} ${content}`, userId, post._id.toString());
        return post

    } catch (error) {
        console.error("Error in post service:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }

}



export const getAllPostsService = async (userId: string, { page = 1, limit = 10 }: {
    page?: number
    limit?: number
}) => {

    try {
        const skips = (page - 1) * limit

        const [posts, totalPosts] = await Promise.all([
            PostModel.find({ user: userId }).populate("user", "username fullname avatar isVerified").sort({ createdAt: -1 }).skip(skips).limit(limit).lean(),
            PostModel.countDocuments({ user: userId })
        ])

        return {
            posts,
            totalPosts,
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            hasNextPage: page < Math.ceil(totalPosts / limit)
        }

    } catch (error) {
        console.error("Error in get all posts service:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}



export const getUserPostsService = async (userId: string, { page = 1, limit = 10 }: {
    page?: number
    limit?: number
}) => {
    try {
        const skips = (page - 1) * limit

        const [posts, totalPosts] = await Promise.all([
            PostModel.find({ user: userId }).sort({ createdAt: -1 }).skip(skips).limit(limit).lean(),
            PostModel.countDocuments({ user: userId })
        ])

        return {
            posts,
            totalPosts,
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            hasNextPage: page < Math.ceil(totalPosts / limit)
        }

    } catch (error) {
        console.error("Error in get all posts service:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}



export const getSinglePostService = async (postId: string) => {

    try {

        const post = await PostModel.findById(postId).populate("user", "fullname , username , avatar").lean()

        if (!post) {
            throw new Error("Post not found")
        }

        return post

    } catch (error) {
        console.error("Error in get single post service:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}


export const updatePostService = async (postId: string, userId: string, updatedData: IPostUpdateBody) => {
    try {

        const post = await PostModel.findById(postId)

        if (!post) {
            throw new Error("Post not found")
        }

        if (post.user.toString() !== userId) {
            throw new Error("Unauthorized")
        }

        const updateFields = {
            ...(updatedData.title && { title: updatedData.title }),
            ...(updatedData.content && { content: updatedData.content }),
            ...(updatedData.tags && { tags: updatedData.tags }),
            ...(updatedData.category && { category: updatedData.category }),
            ...(typeof updatedData.isPublished !== "undefined" && {
                isPublished: updatedData.isPublished
            }),
            ...(updatedData.coverImage && {
                coverImage: updatedData.coverImage
            }),
        };

        const UpdatePost = await PostModel.findByIdAndUpdate(postId, { ...updateFields }, { new: true, runValidators: true })

        if (!UpdatePost) {
            throw new Error("Post not found")
        }

        return UpdatePost

    } catch (error) {
        console.error("Error in update post service:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}


export const deletePostService = async (postId: string, userId: string) => {

    try {

        const deletedPost = await PostModel.findOneAndDelete({
            _id: postId,
            user: userId
        });

        if (!deletedPost) {
            throw new Error("Post not found");
        }

        return deletedPost;

    } catch (error) {
        console.error("Error in delete post service:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}


export const searchPostService = async (query: string, { page = 1, limit = 10, category, tag }: {
    page?: number
    limit?: number
    category?: string
    tag?: string
}) => {
    try {
        const safeLimit = Math.max(1, limit);
        const skip = (page - 1) * safeLimit;

        const filter: Record<string, unknown> = { isPublished: true };

        if (query) {
            filter.$text = {
                $search: query
            };
        }

        if (category) {
            filter.category = {
                $regex: `^${escapeRegex(category)}$`,
                $options: "i"
            };

        }

        if (tag) {
            const safeTag = escapeRegex(tag);

            filter.tags = {
                $regex: `^${safeTag}$`,
                $options: "i"
            };
        }

        const [posts, totalPosts] = await Promise.all([
            PostModel.find(
                filter,
                query
                    ? {
                        score: {
                            $meta: "textScore"
                        }
                    }
                    : {}
            )
                .populate({
                    path: "user",
                    select: "username fullname avatar"
                })
                .sort(
                    query
                        ? { score: { $meta: "textScore" } }
                        : { createdAt: -1 }
                )
                .skip(skip)
                .limit(safeLimit)
                .lean(),

            PostModel.countDocuments(filter)
        ]);

        const totalPages = Math.max(
            1,
            Math.ceil(totalPosts / safeLimit)
        );

        return {
            posts,
            totalPosts,
            results: posts.length,
            searchQuery: query,
            category,
            tag,
            currentPage: page,
            totalPages,
            limit: safeLimit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }



    } catch (error) {
        console.error("Error in search post service:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}