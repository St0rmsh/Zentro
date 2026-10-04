import type { Request, Response } from "express";
import { semanticSearchService } from "../services/ai-semantic.service.js";
import { getReaderQuestionsInsightService } from "../services/ai-insight.service.js";

export const semanticSearchController = async (req: Request, res: Response) => {
    try {
        const { query, page, limit } = req.query;
        if (!query) return res.status(400).json({ success: false, message: "Query is required" });

        const results = await semanticSearchService(
            String(query), 
            Number(page) || 1, 
            Number(limit) || 10
        );
        return res.status(200).json({ success: true, data: results });
    } catch (error) {
        return res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Error" });
    }
};

export const getReaderQuestionsInsightController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

        const insights = await getReaderQuestionsInsightService(userId.toString());
        return res.status(200).json({ success: true, data: insights });
    } catch (error) {
        return res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Error" });
    }
};
