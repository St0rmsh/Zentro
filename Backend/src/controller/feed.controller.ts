import {getFeedService} from "../services/feed.service.js";
import type {Request,Response} from "express";
import type { IFeedQuery } from "../types/Feed/feed.types.js";



export const getFeedController = async (req: Request, res: Response) => {

    try {

      if (!req.user?._id) {
       return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
}


      const userId = req.user._id.toString();

       const { page, limit, tab } =
        req.query;

      const result =
        await getFeedService(
          userId,
          Number(page) || 1,
          Number(limit) || 10,
          (tab as string) || "home"
        );


console.log(result.posts.length);
console.log(result.posts);

      return res.status(200).json({
        success: true,
        message:
          result.posts.length > 0
            ? "Feed fetched successfully"
            : "No posts found",
        ...result
      });

    } catch (error) {
        console.error("Error in feed controller:", error);

        return res.status(400).json({
            success:false,
            message:error instanceof Error ? error.message : "feed failed"
        });
    }
}