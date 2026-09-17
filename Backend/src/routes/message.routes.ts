import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getConversationController, getInboxController, markConversationReadController, sendMessageController } from "../controller/message.controller.js";

const router = Router();
router.use(authMiddleware);

// Must come before "/:userId" so it isn't matched as a userId param
router.get("/inbox", getInboxController);

router.get("/:userId", getConversationController);
router.post("/:userId", sendMessageController);
router.patch("/:userId/read", markConversationReadController);

export default router;