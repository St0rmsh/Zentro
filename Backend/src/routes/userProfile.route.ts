import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getUserProfileByUsernameController, getUserProfileController } from "../controller/UserProfile.controller.js";

const userProfileRouter = Router();

userProfileRouter.get("/username/:username", authMiddleware, getUserProfileByUsernameController);
userProfileRouter.get("/:userId", authMiddleware, getUserProfileController);

export default userProfileRouter;
