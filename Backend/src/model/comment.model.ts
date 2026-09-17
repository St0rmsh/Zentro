import mongoose from "mongoose";
import type {IComment} from "../types/Comments/Comments.types.js";

const commentSchema = new mongoose.Schema<IComment>(
    {
        content: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
        parentComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
    },
    { timestamps: true }
)


const CommentModel = mongoose.model<IComment>("Comment",commentSchema)

export default CommentModel