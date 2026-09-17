import mongoose from "mongoose";
import type { IFollower } from "../types/follower/follower.types.js";


const followerSchema = new mongoose.Schema<IFollower>(

    {
        followerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        followingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }

)

followerSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

const FollowerModel = mongoose.model<IFollower>("Follower", followerSchema);

export default FollowerModel;
