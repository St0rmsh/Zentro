import type { Request, Response } from "express"
import { createCommentService, deleteCommentService, getCommentService, getSingleCommentService, updateCommentService } from "../services/comment.service.js"
import { moderateContent } from "../services/ai-moderation.service.js";
import { getVibeScore } from "../services/ai-vibe.service.js";
import CommentModel from "../model/comment.model.js";


export const commentController = async (req:Request<{postId:string}>,res:Response)=>{
    try {

        const userId = req.user?._id
        const postId = req.params.postId
        const content = req.body.content

        if(!userId){
            return res.status(401).json({
                message: "Unauthorized",
                success: false
            })
        }

        if (!postId) {
            return res.status(400).json({
            success: false,
            message: "Post ID is required"
            });
        }

        if (!content?.trim()) {
             return res.status(400).json({
            success: false,
           message: "Comment content is required"
            });
        }
        
        const moderationResult = await moderateContent(content);
        if (!moderationResult.isSafe) {
            return res.status(400).json({
                success: false,
                message: `Comment violates community guidelines: ${moderationResult.reason}`
            });
        }
        
        const result = await createCommentService(postId,userId,content)

        return res.status(201).json({
            message: "Comment created successfully",
            success: true,
            data: result
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Internal Server Error"
    });
    }
}


export const getCommentController = async (req:Request<{postId:string}, {}, {}, { page?: string, limit?: string }>, res:Response)=>{
    try {

        const postId = req.params.postId
        const { page, limit } = req.query;

        if(!postId){
            return res.status(400).json({
                message: "Post ID is required",
                success: false
            })
        }

        const pageNum = Math.max(1, parseInt(page as string) || 1);
        const limitNum = Math.min(50, Math.max(1, parseInt(limit as string) || 10));

        const comment = await getCommentService(postId, pageNum, limitNum)

        return res.status(200).json({
            message: "Comment fetched successfully",
            success: true,
            ...comment // Spread since it returns { comments, totalComments, ... }
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Internal Server Error"
    });
    }
}



export const getSingleCommentController = async (req:Request<{commentId:string}>,res:Response)=>{
    try {

        const commentId = req.params.commentId

        if(!commentId){
            return res.status(400).json({
                message: "Comment ID is required",
                success: false
            })
        }

        const comment = await getSingleCommentService(commentId)

        return res.status(200).json({
            message: "Comment fetched successfully",
            success: true,
            comment: comment
        })

    } catch (error) {
       
        if (
            error instanceof Error &&
            error.message === "Comment not found"
        ) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Internal Server Error"
        });
    }
}



export const updateCommentController = async (req:Request<{commentId:string}>,res:Response)=>{
    try {
        
        const userId = req.user?._id
        const commentId = req.params.commentId
        const content = req.body.content

        if(!userId){
            return res.status(401).json({
                message: "Unauthorized",
                success: false
            })
        }

        if (!commentId) {
            return res.status(400).json({
                message: "Comment ID is required",
                success: false
            })
        }

        if (!content?.trim()) {
             return res.status(400).json({
            success: false,
           message: "Comment content is required"
            });
        }

        const comment = await updateCommentService(commentId,userId,content)

        return res.status(200).json({
            message: "Comment updated successfully",
            success: true,
            comment: comment
        })

    } catch (error) {
        if (
            error instanceof Error &&
            error.message === "Comment not found"
        ) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        if (
            error instanceof Error &&
            error.message === "You are not authorized to update this comment"
        ) {
            return res.status(403).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Internal Server Error"
        });
    }
}


export const deleteCommentController = async (req:Request<{commentId:string}>,res:Response)=>{
    try {
        
        const userId = req.user?._id
        const commentId = req.params.commentId

        if(!userId){
            return res.status(401).json({
                message: "Unauthorized",
                success: false
            })
        }

        if (!commentId) {
            return res.status(400).json({
                message: "Comment ID is required",
                success: false
            })
        }

        const result = await deleteCommentService(commentId,userId)

        return res.status(200).json({
            message: "Comment deleted successfully",
            success: true,
            data: result
        })

    } catch (error) {
        if (
            error instanceof Error &&
            error.message === "Comment not found"
        ) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        if (
            error instanceof Error &&
            error.message === "You are not authorized to delete this comment"
        ) {
            return res.status(403).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Internal Server Error"
        });
    }
}

export const getVibeController = async (req: Request<{ postId: string }>, res: Response) => {
    try {
        const postId = req.params.postId;
        if (!postId) {
            return res.status(400).json({ success: false, message: "Post ID is required" });
        }

        const comments = await CommentModel.find({ post: postId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select("content")
            .lean();
            
        const commentContents = comments.map(c => c.content);
        const vibe = await getVibeScore(commentContents);

        return res.status(200).json({ success: true, vibe });
    } catch (error) {
        return res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
    }
};