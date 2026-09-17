import type { Request, Response } from "express";
import { createBookmarkService, getMyBookmarksService } from "../services/bookmark.service.js";
import type { IBookmarkQuery } from "../types/Bookmark/bookmark.Types.js";



export const bookmarkController = async (req:Request<{postId:string}>, res:Response) => {
  try {
      const userId = req.user?._id;
    const postId = req.params.postId;

    if(!userId){
        return res.status(401).json({
            success:false,
            message:"Unauthorized"
        })
    }
    
    if (!postId) {
        return res.status(400).json({
            success:false,
            message:"Post ID is required"
        })
    }

    const bookmark = await createBookmarkService(userId, postId);

    return res.status(200).json({
        success: true,
        message: bookmark.message,
        bookmark
    });
  } catch (error) {
    console.error("Error in bookmark controller:", error);

    return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "bookmark failed"
    });
  }
};


export const getMyBookmarksController = async (req:Request<{}, {}, {}, IBookmarkQuery> , res:Response)=>{
  try {
    const userId = req.user?._id;

    if(!userId){
      return res.status(401).json({
        success:false,
        message:"Unauthorized"
      })
    }

    const { page, limit } = req.query;

        const result = await getMyBookmarksService(
            userId,
            Math.max(1, Number(page) || 1),
            Math.min(50, Math.max(1, Number(limit) || 10))
        );

        return res.status(200).json({
            success: true,
            ...result
        })

  } catch (error) {
    console.error("Error in get my bookmarks controller:", error);
    return res.status(400).json({
      success:false,
      message: error instanceof Error ? error.message : "bookmark failed"
    })
  }
}