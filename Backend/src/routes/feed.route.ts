import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getFeedController } from "../controller/feed.controller.js";

const feedRouter = Router();

// @route: GET /api/feed
// @desc: Get home feed
// @access: Private
feedRouter.get("/", authMiddleware, getFeedController);



export default feedRouter;
