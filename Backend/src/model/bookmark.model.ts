import mongoose from "mongoose";
import type { IBookmark } from "../types/Bookmark/bookmark.Types.js";



const bookmarkSchema = new mongoose.Schema<IBookmark>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true
        }
    },
    { timestamps: true }
)

bookmarkSchema.index({ user: 1, post: 1 },{ unique: true })

bookmarkSchema.index({ user: 1, createdAt: -1 });

const bookmarkmodel = mongoose.model("Bookmark", bookmarkSchema);

export default bookmarkmodel