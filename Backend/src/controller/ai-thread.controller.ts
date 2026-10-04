import type { Request, Response } from "express";
import { summarizeThreadService, commentNudgeService } from "../services/ai-thread.service.js";

export const summarizeThreadController = async (req: Request<{ postId: string }>, res: Response) => {
    try {
        const { postId } = req.params;
        const { commentId } = req.query;
        
        const summary = await summarizeThreadService(postId, commentId as string);
        return res.status(200).json({ success: true, data: summary });
    } catch (error) {
        return res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Error" });
    }
};

export const commentNudgeController = async (req: Request, res: Response) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ success: false, message: "Content is required" });
        
        const result = await commentNudgeService(content);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Error" });
    }
};
