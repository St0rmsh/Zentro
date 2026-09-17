import mongoose from "mongoose";
import MessageModel from "../model/message.model.js";
import UserModel from "../model/auth.model.js";
import { handleAIChatMessage } from "./ai-chat.service.js";

export const getConversationService = async (userId: string, otherUserId: string, page = 1, limit = 50) => {
  if (!mongoose.Types.ObjectId.isValid(otherUserId)) throw new Error("Invalid user ID");
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(100, Math.max(1, limit));
  const filter = { $or: [{ sender: userId, recipient: otherUserId }, { sender: otherUserId, recipient: userId }] };
  const [messages, total] = await Promise.all([
    MessageModel.find(filter).populate("sender", "username fullname avatar").sort({ createdAt: 1 }).skip((safePage - 1) * safeLimit).limit(safeLimit).lean(),
    MessageModel.countDocuments(filter),
  ]);
  return { messages, total, page: safePage, hasMore: safePage * safeLimit < total };
};

export const createMessageService = async (sender: string, recipient: string, content: string, mediaUrl?: string, mediaType?: "image" | "video") => {
  if (!mongoose.Types.ObjectId.isValid(recipient)) throw new Error("Invalid recipient");
  if (!content.trim() && !mediaUrl) throw new Error("Message cannot be empty");
  if (sender === recipient) throw new Error("You cannot message yourself");
  const user = await UserModel.findById(recipient).select("_id isActive email").lean();
  if (!user?.isActive) throw new Error("Recipient not found");
  const messageData = { sender, recipient, content: content.trim() } as { sender: string; recipient: string; content: string; mediaUrl?: string; mediaType?: "image" | "video" };
  if (mediaUrl) messageData.mediaUrl = mediaUrl;
  if (mediaType) messageData.mediaType = mediaType;
  
  const message = await MessageModel.create(messageData);
  
  if (user.email === "ai.system@zentro.com") {
      handleAIChatMessage(sender, content.trim()).catch(console.error);
  }
  
  return message;
};

export const markConversationReadService = async (userId: string, senderId: string) => {
  await MessageModel.updateMany({ sender: senderId, recipient: userId, readAt: { $exists: false } }, { $set: { readAt: new Date() } });
};

// Returns one row per conversation partner: last message + unread count + partner's public info,
// sorted by most recent activity — this is what powers the Instagram/LinkedIn-style inbox list.
export const getInboxService = async (userId: string) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const conversations = await MessageModel.aggregate([
    { $match: { $or: [{ sender: userObjectId }, { recipient: userObjectId }] } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: {
          $cond: [{ $eq: ["$sender", userObjectId] }, "$recipient", "$sender"],
        },
        lastMessage: { $first: "$$ROOT" },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$recipient", userObjectId] },
                  { $eq: [{ $ifNull: ["$readAt", null] }, null] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    { $sort: { "lastMessage.createdAt": -1 } },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "partner",
      },
    },
    { $unwind: "$partner" },
    {
      $project: {
        _id: 0,
        partnerId: "$_id",
        username: "$partner.username",
        fullname: "$partner.fullname",
        avatar: "$partner.avatar",
        lastMessage: {
          _id: "$lastMessage._id",
          content: "$lastMessage.content",
          mediaType: "$lastMessage.mediaType",
          sender: "$lastMessage.sender",
          createdAt: "$lastMessage.createdAt",
          readAt: "$lastMessage.readAt",
        },
        unreadCount: 1,
      },
    },
  ]);

  return conversations;
};