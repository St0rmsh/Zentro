import type { Types } from "mongoose";


export type NotificationType =
  | "FOLLOW"
  | "LIKE"
  | "COMMENT"
  | "BOOKMARK"
  | "POST_PUBLISHED"
  | "MENTION";

export interface INotification {
   recipient:Types.ObjectId,
   sender:Types.ObjectId,
   type:NotificationType,
   post?:Types.ObjectId,
   comment?:Types.ObjectId,
   message?:string,
   isRead:boolean,
   createdAt?:Date,
   updatedAt?:Date,
}


export interface CreateNotificationBody {
  recipient: string;
  sender: string;
  type: NotificationType;
  post?: string;
  comment?: string;
  message: string;
}