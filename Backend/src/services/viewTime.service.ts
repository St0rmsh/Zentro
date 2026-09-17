import ViewEventModel from "../model/viewEvent.model.js";
import PostModel from "../model/post.model.js";
import { updateUserInterestService } from "./interest.service.js";

export const trackViewTimeService = async (postId: string, userId: string, durationMs: number) => {
    try {
        const post = await PostModel.findById(postId);
        if (!post) {
            throw new Error("Post not found");
        }

        // Always log the view event for analytics
        await ViewEventModel.create({
            user: userId,
            post: postId,
            durationMs: durationMs
        });

        // Only log the view event for analytics, no need to increment viewsCount again
        // as it is handled by view.service.ts when the post is first opened.
        if (durationMs >= 2000) {
            // Reusing logic from view.service to update interest profile 
            // (Optional: we can leave interest update or remove it. Let's remove double counting)
            // Removed double viewsCount increment
        }

        return {
            success: true,
            message: "View time tracked successfully"
        };
    } catch (error) {
        console.error("Error in view time service:", error);
        throw new Error(error instanceof Error ? error.message : "Unknown error in view time service");
    }
};
