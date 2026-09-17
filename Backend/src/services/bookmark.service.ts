import bookmarkmodel from "../model/bookmark.model.js";
import PostModel from "../model/post.model.js";
import { updateUserInterestService } from "./interest.service.js";
import { createNotificationService } from "./notification.service.js";

export const createBookmarkService = async (userId:string , postId:string)=>{
    try {

        const post = await PostModel.findById(postId);

        if (!post) {
            throw new Error("Post not found");
        }

        const existingBookmark = await bookmarkmodel.findOne({user:userId,post:postId})

        if(existingBookmark){
            await bookmarkmodel.findByIdAndDelete(existingBookmark._id)

             await updateUserInterestService(userId,postId,-3);

            return {
                message:"Bookmark removed",
                bookmarked:false
            }
        }
         await bookmarkmodel.create({
            user:userId,
            post:postId
        })

        await createNotificationService({
            type: "BOOKMARK",
            recipient: post.user.toString() as string,
            sender: userId,
            post: postId,
            message: "Bookmarked your post",
        });

        await updateUserInterestService(userId,postId,5);

        return {
            message: "Post bookmarked",
            bookmarked: true
        }
        
    } catch (error) {
        console.error("Error in create Bookmark service:", error);
        throw new Error(
            error instanceof Error
                ? error.message
                : "Unknown error"
        );
    }
}



export const getMyBookmarksService = async (userId:string,page = 1,
  limit = 10)=>{
    try {
        
 const safePage = Math.max(1, page);
const safeLimit = Math.max(1, limit);
const skip = (safePage - 1) * safeLimit;


        const [bookmarks, totalBookmarks] = await Promise.all([
            bookmarkmodel
                .find({ user: userId })
                .populate({
                    path: "post",
                    select:
                        "title content coverImage category tags likesCount commentsCount viewsCount createdAt updatedAt isPublished",
                    populate: {
                        path: "user",
                        select: "fullname username avatar"
                    }
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(safeLimit)
                .lean(),

            bookmarkmodel.countDocuments({
                user: userId
            })
        ]);

        const totalPages = Math.max(
            1,
            Math.ceil(totalBookmarks / safeLimit)
        );


        return {
            bookmarks,
            totalBookmarks,
            results: bookmarks.length,
            currentPage: safePage,
            totalPages,
            limit: safeLimit,
            hasNextPage: safePage < totalPages,
            hasPrevPage: safePage > 1
        }

    } catch (error) {
        console.error("Error in get my bookmarks service:", error);
        throw new Error(
            error instanceof Error
                ? error.message
                : "Unknown error"
        );
    }
}