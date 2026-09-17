import type { Request, Response } from "express";
import { Likeservice } from "../services/like.service.js";



export const LikeController = async (req:Request<{postId:string}>,res: Response)=>{

    try{


        const userId = req.user?._id
        const postId = req.params.postId

       if (!userId) {
         return res.status(401).json({
            message:"Unauthorized",
            success:false
         })
       }

       const Like = await Likeservice(postId,userId)

       return res.status(200).json({
            message: Like.message,
            success: true,
            data: Like
       })

    }catch(error){
        return res.status(500).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Internal Server Error"
    });
    }
}