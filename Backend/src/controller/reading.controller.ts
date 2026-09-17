import type { Request, Response } from "express";
import { getReadingStatsService, syncReadingProgressService } from "../services/reading.service.js";

export const getReadingStatsController = async (req: Request, res: Response) => {
  try {
    const data = await getReadingStatsService(req.user!._id.toString());
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Unable to load reading stats" });
  }
};

export const syncReadingProgressController = async (req: Request, res: Response) => {
  try {
    const { postId, percentage, secondsSpent } = req.body as { postId?: string; percentage?: number; secondsSpent?: number };
    if (!postId) throw new Error("postId is required");

    await syncReadingProgressService(req.user!._id.toString(), postId, Number(percentage) || 0, Number(secondsSpent) || 0);
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Unable to sync reading progress" });
  }
};