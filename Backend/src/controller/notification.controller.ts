import type { Request, Response } from "express";
import { getNotificationsService,getUnreadNotificationCountService,markNotificationAsReadService,markAllNotificationsAsReadService,deleteNotificationService} from "../services/notification.service.js";




export const getNotificationsController = async (req: Request,res: Response) => {

    try {

      if (!req.user?._id) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const page = Number(req.query.page) || 1;

      const limit = Number(req.query.limit) || 10;

      const result =
        await getNotificationsService(req.user._id.toString(),page,limit);

      return res.status(200).json({
        success: true,
        message:"Notifications fetched successfully",
        ...result
      });


    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error? error.message: "Failed"
    });
    }
  };




export const getUnreadNotificationCountController = async (req: Request,res: Response) => {
    
    try {
      const result =
        await getUnreadNotificationCountService(
          req.user!._id.toString()
        );

      return res.status(200).json({
        success: true,
        ...result
      });

    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed"
      });
    }
  };





export const markNotificationAsReadController = async (req: Request<{notificationId: string;}>,res: Response) => {

    try {
      const notification = await markNotificationAsReadService(req.params.notificationId,req.user!._id.toString());

      return res.status(200).json({
        success: true,
        message:
          "Notification marked as read",
        notification
      });

    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error? error.message: "Failed"
      });
    }
  };



export const markAllNotificationsAsReadController = async (req: Request,res: Response) => {

    try {

      const result = await markAllNotificationsAsReadService(req.user!._id.toString());

      return res.status(200).json({
        success: true,
        message:
          "All notifications marked as read",
        ...result
      });
      
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message: "Failed"
      });
    }
  };




export const deleteNotificationController = async (req: Request<{notificationId: string;}>,res: Response) => {
    
    try {
      const result = await deleteNotificationService(req.params.notificationId,req.user!._id.toString());

      return res.status(200).json({
        success: true,
        message:
          "Notification deleted successfully",
        ...result
      });

    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message: "Failed"
      });
    }
  };