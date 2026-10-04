import type { Request, Response } from "express";
import CommentModel from "../model/comment.model.js";
import PostModel from "../model/post.model.js";
import mongoose from "mongoose";

export const getSuggestedReplies = async (req: Request<{ postId: string }>, res: Response) => {
    try {
        const userId = req.user?._id;
        const postId = req.params.postId;

        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

        const post = await PostModel.findById(postId);
        if (!post) return res.status(404).json({ success: false, message: "Post not found" });

        if (post.user.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Only the author can view suggested replies" });
        }

        const suggestedReplies = await CommentModel.find({
            post: postId,
            isAI: true,
            "aiMeta.status": "pending_approval"
        }).populate("parentComment").sort({ createdAt: -1 });

        return res.status(200).json({ success: true, suggestedReplies });
    } catch (error) {
        return res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
    }
};

export const approveSuggestedReply = async (req: Request<{ commentId: string }>, res: Response) => {
    try {
        const userId = req.user?._id;
        const commentId = req.params.commentId;

        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

        const comment = await CommentModel.findById(commentId);
        if (!comment || !comment.isAI || comment.aiMeta?.status !== "pending_approval") {
            return res.status(404).json({ success: false, message: "Suggested reply not found" });
        }

        const post = await PostModel.findById(comment.post);
        if (!post || post.user.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Only the author can approve replies" });
        }

        // The user might edit the content before approving
        const content = req.body.content || comment.content;

        const updatedComment = await CommentModel.findByIdAndUpdate(commentId, {
            user: userId, // Reassign authorship to the actual user
            content,
            "aiMeta.status": "published"
        }, { new: true });

        // Since it's now a real comment, update post counts
        await PostModel.findByIdAndUpdate(comment.post, { $inc: { commentsCount: 1 } });

        return res.status(200).json({ success: true, comment: updatedComment });
    } catch (error) {
        return res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
    }
};

export const rejectSuggestedReply = async (req: Request<{ commentId: string }>, res: Response) => {
    try {
        const userId = req.user?._id;
        const commentId = req.params.commentId;

        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

        const comment = await CommentModel.findById(commentId);
        if (!comment || !comment.isAI || comment.aiMeta?.status !== "pending_approval") {
            return res.status(404).json({ success: false, message: "Suggested reply not found" });
        }

        const post = await PostModel.findById(comment.post);
        if (!post || post.user.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Only the author can reject replies" });
        }

        await CommentModel.findByIdAndDelete(commentId);

        return res.status(200).json({ success: true, message: "Suggested reply dismissed" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
    }
};
