import type { Types } from "mongoose";

export interface ILike {
    _id: string,
    user: Types.ObjectId,
    postId: Types.ObjectId,

    createdAt?: Date,
    updatedAt?: Date,
    
}

