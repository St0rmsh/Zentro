import  type { Request, Response } from "express";
import type { IFollowersBody, IUnfollowBody } from "../types/follower/follower.types.js";
import { followUserService, getAllFollowersService, getAllFollowingService, getFollowStatusService, unfollowUserService } from "../services/Followers.service.js";
import UserModel from "../model/auth.model.js";


export const followUserController = async (req: Request<{userId:string}>,
    res: Response
) => {
    try {

        const followerId = req.user?._id;
        const followingId = req.params.userId;

        if (!followerId || !followingId) {
            throw new Error("Unauthorized");
        }

        const follower = await followUserService(followerId, followingId);

        return res.status(201).json({
            success: true,
            message: "User followed successfully",
            data: follower,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal Server Error"
        });
    }
}




export const unfollowUserController = async(req: Request<{userId:string}>, res:Response)=>{

    try {

        const unfollowerId = req.user?._id;
        const unfolloweeId = req.params.userId;

        if (!unfollowerId || !unfolloweeId) {
            throw new Error("Unauthorized");
        }

        const result = await unfollowUserService(unfollowerId,unfolloweeId)

        return res.status(200).json({
            success: true,
            message: "User Unfollowed Successfully",
            data: result
        })
        
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal Server Error"
        });
    }
}




export const getAllFollowersController = async (req:Request<{userId:string}>, res:Response)=>{

    try {
        
        const userId = req.params.userId;

        if(!userId){
            throw new Error("User ID is required");
        }

        const followers = await getAllFollowersService(userId)

        return res.status(200).json({
            success: true,
            message: "Followers fetched successfully",
            count: followers.length,
            data: followers,
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal Server Error"
        });
    }
}





export const getAllFollowingController = async(req:Request<{userId:string}>, res:Response)=>{
    
    try {
        
        const userId = req.params.userId;

        if(!userId){
            throw new Error("User ID is required");
        }

        const following = await getAllFollowingService(userId)

        return res.status(200).json({
            success: true,
            message: "Following fetched successfully",
            count: following.length,
            data: following,
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal Server Error"
        });
    }
}




export const getFollowStatusController = async (req: Request<{ userId: string }>,res: Response) => {
    try {
        const targetUserId = req.params.userId;
        const currentUserId = req.user?._id;

        if (!currentUserId) {
    return res.status(401).json({
        success: false,
        message: "Unauthorized",
    });
}

        const status = await getFollowStatusService(
            String(currentUserId),
            targetUserId
        );

        return res.status(200).json({
            success: true,
            message: "Follow status fetched successfully",
            data: status,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Internal Server Error",
        });
    }
};