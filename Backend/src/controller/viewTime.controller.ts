import type { Request, Response } from "express";
import { trackViewTimeService } from "../services/viewTime.service.js";

export const trackViewTimeController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const { postId, durationMs } = req.body;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
                success: false
            });
        }

        if (!postId) {
            return res.status(400).json({
                success: false,
                message: "Post ID is required"
            });
        }

        if (typeof durationMs !== "number" || durationMs < 0) {
            return res.status(400).json({
                success: false,
                message: "Valid durationMs is required"
            });
        }

        const result = await trackViewTimeService(postId, userId, durationMs);

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal Server Error"
        });
    }
};
