import UserModel from "../model/auth.model.js";
import FollowerModel from "../model/Follower.model.js";
import { updateUserInterestService } from "./interest.service.js";
import { createNotificationService } from "./notification.service.js";


export const followUserService = async (followerId:string,followingId:string) => {

    try {
        

     if (followerId === followingId) {
        throw new Error("You cannot follow yourself");
    }

     const user = await UserModel.findById(followerId);

     if(!user){
        throw new Error("User not found");
     }

     const existingFollow = await FollowerModel.findOne({followerId,followingId});

    if (existingFollow) {
        throw new Error("Already following this user");
    }


     const followingUser  = await UserModel.findById(followingId)

     if(!followingUser ){
        throw new Error("User not found");
     }

     const following = await FollowerModel.create({
        followerId,
        followingId
     })

    await createNotificationService({
        type: "FOLLOW",
        recipient: followingUser._id.toString(),
        sender: followerId,
        message: "Started following you",
    });

    await updateUserInterestService(followerId,followingId,3);

     return following


    } catch (error) {
         console.error("Error in follower service:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
    
}




export const unfollowUserService = async (unfollowerId:string,unfolloweeId:string)=>{

    try {
        
       if (unfollowerId === unfolloweeId) {
    throw new Error("You cannot unfollow yourself");
}

    const followingUser = await UserModel.findById(unfollowerId);

    if(!followingUser){
        throw new Error("User not found");
    }


     const existingFollow = await FollowerModel.findOne({followerId:unfollowerId,followingId:unfolloweeId});

    if (!existingFollow) {
        throw new Error("Not following this user");
    }

     const user = await UserModel.findById(unfolloweeId);

    if(!user){
        throw new Error("User not found");
    }

    const unfollow = await FollowerModel.deleteOne({followerId:unfollowerId,followingId:unfolloweeId});

    return {
    followerId: unfollowerId,
    followingId: unfolloweeId,
    unfollowed: true,
  };

    } catch (error) {
        console.error("Error in unfollow service:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}



export const getAllFollowersService = async (userId:string)=>{

    try {

        const user = await UserModel.findById(userId);

        if(!user){
            throw new Error("User not found");
        }
        
        const followers = await FollowerModel.find({followingId:userId}).populate("followerId", "fullname username avatar").lean();

        return followers.map((f) => f.followerId);
        
    } catch (error) {
        console.error("Error in get all followers service:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}





export const getAllFollowingService = async (userId:string)=>{
    try {
        
        const user = await UserModel.findById(userId);

        if(!user){
            throw new Error("User not found");
        }
        
        const following = await FollowerModel.find({followerId:userId}).populate("followingId", "fullname username avatar").lean();

        return following.map((f) => f.followingId);
        
    } catch (error) {
        console.error("Error in get all following service:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}


export const getFollowStatusService = async (currentUserId: string,targetUserId: string) => {
    try {
        const user = await UserModel.findById(targetUserId);

        if (!user) {
            throw new Error("User not found");
        }

        const following = await FollowerModel.exists({
            followerId: currentUserId,
            followingId: targetUserId,
        });

        return {
            isFollowing: Boolean(following),
            isOwnProfile: currentUserId === targetUserId,
        };

    } catch (error) {
        console.error("Error in get follow status service:", error);

        throw new Error(
            error instanceof Error
                ? error.message
                : "Unknown error"
        );
    }
};