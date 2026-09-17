import NotificationModel from "../model/notification.model.js";
import type { CreateNotificationBody } from "../types/Notification/notification.types.js";
import { emitNotification } from "../utils/emitNotification.js";
import UserModel from "../model/auth.model.js";




export const createNotificationService = async (data: CreateNotificationBody) => {

  try {
    if (data.recipient.toString() === data.sender.toString()) {
    return null;
    }

    const recipient = await UserModel.findById(data.recipient).select("notificationPreferences").lean();
    const preferenceKey = data.type === "LIKE" ? "likes" : data.type === "COMMENT" ? "comments" : data.type === "FOLLOW" ? "follows" : data.type === "MENTION" ? "mentions" : data.type === "BOOKMARK" ? "bookmarks" : null;
    if (preferenceKey && recipient?.notificationPreferences?.[preferenceKey] === false) return null;

    const existingNotification = await NotificationModel.findOne({
    recipient: data.recipient.toString(),
    sender: data.sender.toString(),
    type: data.type,
    post: data.post ?? null,
    comment: data.comment ?? null,
    isRead: false
    });

    if (existingNotification) {
    return existingNotification;
    }

    const notification = await NotificationModel.create(data);

    await notification.populate("sender","fullname username avatar");

    const recipientId = data.recipient.toString();

    const unreadCount = await NotificationModel.countDocuments({recipient: recipientId,isRead: false});

    emitNotification( recipientId,{notification,unreadCount});

    return notification;

  } catch (error) {
    console.error("Error creating notification:", error);

    throw new Error(
      error instanceof Error
        ? error.message
        : "Unknown error"
    );
  }
};

export const notifyMentionedUsersService = async (text: string, sender: string, post?: string, comment?: string) => {
  const usernames = [...text.matchAll(/@([a-zA-Z0-9_]{3,30})/g)]
    .map((match) => match[1])
    .filter((username): username is string => Boolean(username))
    .map((username) => username.toLowerCase());
  const users = await UserModel.find({ username: { $in: usernames } }).select("_id").lean();
  await Promise.all(users.map((user) => createNotificationService({
    recipient: user._id.toString(),
    sender,
    type: "MENTION",
    ...(post ? { post } : {}),
    ...(comment ? { comment } : {}),
    message: "Mentioned you in a post",
  })));
};




export const getNotificationsService = async (userId: string,page = 1,limit = 10) => {

  try {

    const safePage = Math.max(1, page);
    const safeLimit = Math.min(50, Math.max(1, limit));
    const skip = (safePage - 1) * safeLimit;

    const [notifications, totalNotifications] =
      await Promise.all([
        NotificationModel.find({
          recipient: userId
        })
          .populate(
            "sender",
            "fullname username avatar"
          )
          .populate(
            "post",
            "title coverImage"
          )
          .populate(
            "comment",
            "content"
          )
          .sort({
            createdAt: -1
          })
          .skip(skip)
          .limit(safeLimit)
          .lean(),

        NotificationModel.countDocuments({
          recipient: userId
        })
      ]);

    const totalPages = Math.max(
      1,
      Math.ceil(
        totalNotifications / safeLimit
      )
    );

    return {
      notifications,
      totalNotifications,
      currentPage: safePage,
      totalPages,
      limit: safeLimit,
      hasNextPage:
        safePage < totalPages,
      hasPrevPage:
        safePage > 1
    };

  } catch (error) {
    console.error("Error fetching notifications:",error);

    throw new Error(error instanceof Error? error.message: "Unknown error");
  }
};





export const getUnreadNotificationCountService = async (userId: string) => {

    try {
      const unreadCount =
        await NotificationModel.countDocuments(
          {
            recipient: userId,
            isRead: false
          }
        );

      return {
        unreadCount
      };

    } catch (error) {
      console.error(error);

      throw new Error( error instanceof Error ? error.message : "Unknown error");
    }
  };




export const markNotificationAsReadService = async (notificationId: string,userId: string) => {

    try {
      const notification =
        await NotificationModel.findOneAndUpdate(
          {
            _id: notificationId,
            recipient: userId
          },
          {
            isRead: true
          },
          {
            new: true
          }
        );

      if (!notification) {
        throw new Error(
          "Notification not found"
        );
      }

      return notification;


    } catch (error) {
      console.error(error);

      throw new Error(error instanceof Error? error.message: "Unknown error");
    }
  };





export const markAllNotificationsAsReadService = async (userId: string) => {

    try {

      const result =
        await NotificationModel.updateMany(
          {
            recipient: userId,
            isRead: false
          },
          {
            isRead: true
          }
        );

      return {
        modifiedCount:
          result.modifiedCount
      };


    } catch (error) {
      console.error(error);

      throw new Error(error instanceof Error? error.message: "Unknown error");
    }
  };





export const deleteNotificationService = async (notificationId: string,userId: string) => {

    try {

      const notification = await NotificationModel.findOneAndDelete(
          {
            _id: notificationId,
            recipient: userId
          }
        );

      if (!notification) {
        throw new Error(
          "Notification not found"
        );
      }

      return {
        deleted: true
      };


    } catch (error) {
      console.error(error);

      throw new Error(error instanceof Error? error.message: "Unknown error");
    }
  };