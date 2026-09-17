import PostModel from "../model/post.model.js";
import { updateUserInterestService } from "./interest.service.js";




export const trackPostViewService = async (postId: string,userId: string) => {
  
  const post = await PostModel.findById(postId);

  if (!post) {
    throw new Error("Post not found");
  }

  await PostModel.findByIdAndUpdate(
    postId,
    {
      $inc: {
        viewsCount: 1
      }
    }
  );

  await updateUserInterestService( userId,postId,1);

  return {
    viewed: true
  };
};