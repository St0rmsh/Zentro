import mongoose from "mongoose";
import type { IPost } from "../types/Posts/posts.types.js";



const postSchema = new mongoose.Schema<IPost>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        coverImage: {
            type: String,
        },
        mediaUrl: {
            type: String,
        },
        mediaType: {
            type: String,
            enum: ["image", "video", "none"],
            default: "none",
        },
        summary: {
            type: String,
        },
        likesCount: {
            type: Number,
            default: 0,
            min: 0
        },
        commentsCount: {
            type: Number,
            default: 0,
            min: 0
        },
        viewsCount: {
            type: Number,
            default: 0,
            min: 0
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        category: {
            type: String,
            trim: true,
            enum: [
                "Technology",
                "Programming",
                "AI",
                "General"
            ],
            default: "General",
        },
    },
    { timestamps: true }
);

postSchema.index({ user: 1, createdAt: -1 })

postSchema.index({ category: 1 })

postSchema.index({ tags: 1 })

postSchema.index({ likesCount: -1 });

postSchema.index({ title: "text", content: "text", tags: "text" })

postSchema.index({ isPublished: 1, createdAt: -1 });

postSchema.index({ category: 1, isPublished: 1 });

postSchema.index({ tags: 1, isPublished: 1 });

const PostModel = mongoose.model("Post", postSchema);

export default PostModel;