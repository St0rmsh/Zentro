import LikeModel from "../model/like.model.js"
import PostModel from "../model/post.model.js"
import { updateUserInterestService } from "./interest.service.js";
import { createNotificationService } from "./notification.service.js";



export const Likeservice = async (postId:string , userId:string)=>{


    try {

        const post = await PostModel.findById(postId);

        if (!post) {
            throw new Error("Post not found");
        }
        
        const existingLike = await LikeModel.findOne({
            user:userId,
            postId
        })

        if(existingLike){
            
            await LikeModel.findByIdAndDelete(existingLike._id)

            await PostModel.findByIdAndUpdate(postId,{
                $inc:{
                    likesCount:-1
                }
            })

            await updateUserInterestService(userId,postId,-2);

            return {
                message: "Post unliked successfully",
                liked: false,
            }
        }

        const like = await LikeModel.create({
            user:userId,
            postId
        })

         await updateUserInterestService(userId,postId,3);


        await PostModel.findByIdAndUpdate(postId,{
            $inc:{
                likesCount:1
            }
        })

        await createNotificationService({
            type: "LIKE",
            recipient: post.user.toString() as string,
            sender: userId,
            post: postId,
            message: "liked your post",
        });

        return {
            message: "Post liked successfully",
            liked: true,
        }

    } catch (error) {
        console.error("Error in like service:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
    
}