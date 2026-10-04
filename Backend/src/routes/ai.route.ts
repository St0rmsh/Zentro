import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { suggestTitlesController, grammarFixController, shortenParagraphController, suggestTagsController } from "../controller/ai-writing.controller.js";

const AIRouter = Router();

// @route: POST /api/ai/writing/suggest-titles
AIRouter.post("/writing/suggest-titles", authMiddleware, suggestTitlesController);

// @route: POST /api/ai/writing/grammar-fix
AIRouter.post("/writing/grammar-fix", authMiddleware, grammarFixController);

// @route: POST /api/ai/writing/shorten
AIRouter.post("/writing/shorten", authMiddleware, shortenParagraphController);

// @route: POST /api/ai/writing/suggest-tags
AIRouter.post("/writing/suggest-tags", authMiddleware, suggestTagsController);

import { summarizeThreadController, commentNudgeController } from "../controller/ai-thread.controller.js";

// @route: GET /api/ai/thread/:postId/summary
AIRouter.get("/thread/:postId/summary", summarizeThreadController);

// @route: POST /api/ai/thread/nudge
AIRouter.post("/thread/nudge", commentNudgeController);

import { semanticSearchController, getReaderQuestionsInsightController } from "../controller/ai-semantic.controller.js";

// @route: GET /api/ai/search/semantic
AIRouter.get("/search/semantic", semanticSearchController);

// @route: GET /api/ai/insights/reader-questions
AIRouter.get("/insights/reader-questions", authMiddleware, getReaderQuestionsInsightController);

export default AIRouter;
