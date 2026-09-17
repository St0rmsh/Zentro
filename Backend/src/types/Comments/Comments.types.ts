import type { Types } from "mongoose";

export interface IComment {
    _id: string,
    content: string,
    user: Types.ObjectId,
    post: Types.ObjectId,
    parentComment?:Types.ObjectId,
    createdAt?: Date,
    updatedAt?: Date,
}

export interface ICreateCommentBody{
    content:string,
    post:string,
    parentComment?:string
}

export interface IUpdateCommentBody{
    content:string
}