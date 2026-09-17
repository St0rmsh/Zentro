import { Types } from "mongoose";

export interface IFollower {
    _id: Types.ObjectId;
    followerId: Types.ObjectId;
    followingId: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IFollowersBody {
    userId: string;
}

export interface IUnfollowBody {
    userId: string;
}