import type { Request, Response } from "express";
import { getprofileByUsernameService, getprofileService } from "../services/user.service.js";



export const getUserProfileController = async (req:Request<{userId:string}>,res:Response)=>{
    try {
        const {userId} = req.params;
       
        const stats = await getprofileService(userId);

       return res.status(200).json({
        success:true,
        data: stats
       });
    } catch (error) {
        if(error instanceof Error){
            return res.status(500).json({message:error.message});
        }
        return res.status(500).json({message:"Internal server error"});
    }
}

export const getUserProfileByUsernameController = async (req:Request<{username:string}>,res:Response)=>{
    try {
        const profile = await getprofileByUsernameService(req.params.username);
        return res.status(200).json({ success: true, data: profile });
    } catch (error) {
        return res.status(404).json({ success: false, message: error instanceof Error ? error.message : "User not found" });
    }
};
