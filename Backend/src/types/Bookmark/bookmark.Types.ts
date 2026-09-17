import type {Types} from "mongoose"

export interface IBookmark {
    _id:string,
    user:Types.ObjectId,
    post:Types.ObjectId,

    createdAt?:Date,
    updatedAt?:Date
}



export interface IBookmarkQuery {
    page?: string;
    limit?: string;
}