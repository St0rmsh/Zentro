import CommentModel from "../model/comment.model.js"
import PostModel from "../model/post.model.js"
import { updateUserInterestService } from "./interest.service.js";
import { createNotificationService, notifyMentionedUsersService } from "./notification.service.js";
import UserModel from "../model/auth.model.js";
import { handleAICommentEngagement } from "./ai-engagement.service.js";


export const createCommentService = async (postId:string , userId:string , content:string)=>{

    try {

        const post = await PostModel.findById(postId)

        if(!post){
            throw new Error("Post not found")
        }

        const comment = await CommentModel.create({
            user:userId,
            post:postId,
            content
        })

        await PostModel.findByIdAndUpdate(postId,{
            $inc:{
                commentsCount:1
            }
        })

        await createNotificationService({
            type: "COMMENT",
            recipient: post.user.toString() as string,
            sender: userId,
            post: postId,
            message: "Commented on your post",
        });
        await notifyMentionedUsersService(content, userId, postId, comment._id.toString());

        await updateUserInterestService(userId,postId,4);

       await comment.populate("user", "fullname username avatar")

       const author = await UserModel.findById(post.user);
       if (author && author.email === "ai.system@zentro.com" && userId !== author._id.toString()) {
           handleAICommentEngagement(postId, content, post.content).catch(console.error);
       }

        const updatedPost = await PostModel.findById(postId).select("commentsCount")
        
        return {
            comment,
            commentsCount: updatedPost?.commentsCount ?? 0,
        }
    } catch (error) {
       console.error("Error in Comment service:", error);
        throw new Error(
            error instanceof Error
                ? error.message
                : "Unknown error"
        );
    }    
}




export const getCommentService = async (postId:string , page=1 , limit=10)=>{
    try {
        const post = await PostModel.findById(postId)

        if(!post){
            throw new Error("Post not found")
        }

        const skip = (page-1)*limit
        
      const [comments, totalComments] = await Promise.all([
         CommentModel.find({ post: postId })
        .populate("user", "fullname username avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

    CommentModel.countDocuments({ post: postId })
]);
        
        return {
            comments ,
            totalComments,
            totalPages: Math.ceil(totalComments / limit),
            currentPage: page,
            limit,
            hasNextPage: page < Math.ceil(totalComments / limit),
            hasPrevPage: page > 1
        }
        
    } catch (error) {
        console.error("Error in get Comment service:", error);
        throw new Error(
            error instanceof Error
                ? error.message
                : "Unknown error"
        );
    }
}



export const getSingleCommentService = async (commentId:string)=>{
    try {
        
        const comment = await CommentModel.findById(commentId).populate("user", "fullname username avatar")

        if (!comment) {
            throw new Error("Comment not found");
        }
        
        return comment
        
    } catch (error) {
        console.error("Error in get Comment service:", error);
        throw new Error(
            error instanceof Error
                ? error.message
                : "Unknown error"
        );
    }
}



export const updateCommentService = async (commentId:string , userId:string , content:string)=>{
    try {

        const comment = await CommentModel.findOne({_id:commentId,user:userId})

        if(!comment){
            throw new Error("Comment not found or unauthorized")
        }

        const updateComment = await CommentModel.findByIdAndUpdate(
            commentId,
            {
                content
            },
            {
                new: true,
                runValidators: true
            }
        ).populate("user", "fullname username avatar")
      

        return updateComment
        

    } catch (error) {
        console.error("Error in update Comment service:", error);
        throw new Error(
            error instanceof Error
                ? error.message
                : "Unknown error"
        );
    }
}


export const deleteCommentService = async (commentId:string , userId:string)=>{
    try {

        const comment = await CommentModel.findOne({_id:commentId,user:userId})

        if(!comment){
            throw new Error("Comment not found or unauthorized")
        }

        await CommentModel.findByIdAndDelete(commentId);

        await PostModel.findByIdAndUpdate(
            comment.post,
            {
                $inc: {
                    commentsCount: -1
                }
            }
        );

        const updatedPost = await PostModel.findById(comment.post).select("commentsCount")

        return {
            comment,
            commentsCount: updatedPost?.commentsCount ?? 0,
        }
        
    } catch (error) {
        console.error("Error in delete Comment service:", error);
        throw new Error(
            error instanceof Error
                ? error.message
                : "Unknown error"
        );
    }
}