import type { Request, Response } from "express";
import { suggestTitlesService, grammarFixService, shortenParagraphService, suggestTagsService } from "../services/ai-writing.service.js";

export const suggestTitlesController = async (req: Request, res: Response) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ success: false, message: "Content is required" });
        const titles = await suggestTitlesService(content);
        return res.status(200).json({ success: true, data: titles });
    } catch (error) {
        return res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Error" });
    }
};

export const grammarFixController = async (req: Request, res: Response) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ success: false, message: "Content is required" });
        const fixed = await grammarFixService(content);
        return res.status(200).json({ success: true, data: fixed });
    } catch (error) {
        return res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Error" });
    }
};

export const shortenParagraphController = async (req: Request, res: Response) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ success: false, message: "Content is required" });
        const shortened = await shortenParagraphService(content);
        return res.status(200).json({ success: true, data: shortened });
    } catch (error) {
        return res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Error" });
    }
};

export const suggestTagsController = async (req: Request, res: Response) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ success: false, message: "Content is required" });
        const tags = await suggestTagsService(content);
        return res.status(200).json({ success: true, data: tags });
    } catch (error) {
        return res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Error" });
    }
};
