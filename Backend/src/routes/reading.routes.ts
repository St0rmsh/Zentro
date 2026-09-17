import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getReadingStatsController, syncReadingProgressController } from "../controller/reading.controller.js";

const router = Router();
router.use(authMiddleware);

router.get("/stats", getReadingStatsController);
router.post("/sync", syncReadingProgressController);

export default router;