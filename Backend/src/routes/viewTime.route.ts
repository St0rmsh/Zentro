import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { trackViewTimeController } from "../controller/viewTime.controller.js";

const viewTimeRouter = Router();

// @route: POST /api/view-time
// @desc: Track time spent viewing a post (for Reels auto-play / analytics)
// @access: Private
viewTimeRouter.post("/", authMiddleware, trackViewTimeController);

export default viewTimeRouter;
