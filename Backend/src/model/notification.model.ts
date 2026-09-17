import mongoose from "mongoose";
import type { INotification } from "../types/Notification/notification.types.js";




const notificationSchema = new mongoose.Schema<INotification>({
    recipient:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true
     },

    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    type:{
        type:String,
        enum:["FOLLOW","LIKE","COMMENT","BOOKMARK","POST","MENTION"],
        required:true
    },
    
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    },

    comment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    },

    message:{
        type:String,
        required:true,
        trim:true
    },
    
    isRead:{
        type:Boolean,
        default:false
    }

}, {timestamps:true})
    

notificationSchema.index({recipient: 1,isRead: 1,createdAt: -1});

notificationSchema.index({recipient: 1,createdAt: -1});

notificationSchema.index({sender: 1});

notificationSchema.index({post: 1});

const NotificationModel = mongoose.model("Notification",notificationSchema);

export default NotificationModel;
