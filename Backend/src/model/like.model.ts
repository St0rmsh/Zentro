import mongoose from "mongoose";
import type { ILike } from "../types/likes/Like.types.js";



const likeSchema = new mongoose.Schema<ILike>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }
},{timestamps:true})

likeSchema.index({user:1,postId:1},{unique:true})

const LikeModel = mongoose.model("Like",likeSchema)
export default LikeModel