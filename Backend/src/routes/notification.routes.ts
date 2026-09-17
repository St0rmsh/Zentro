import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  deleteNotificationController,
  getNotificationsController,
  getUnreadNotificationCountController,
  markAllNotificationsAsReadController,
  markNotificationAsReadController,
} from "../controller/notification.controller.js";

const router = Router();

router.get("/", authMiddleware, getNotificationsController);
router.get("/unread-count", authMiddleware, getUnreadNotificationCountController);
router.patch("/:notificationId/read", authMiddleware, markNotificationAsReadController);
router.patch("/read-all", authMiddleware, markAllNotificationsAsReadController);
router.delete("/:notificationId", authMiddleware, deleteNotificationController);

export default router;
