import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { commentController, deleteCommentController, getCommentController, getSingleCommentController, updateCommentController, getVibeController } from "../controller/comment.controller.js";


const CommentRouter = Router()
import { getSuggestedReplies, approveSuggestedReply, rejectSuggestedReply } from "../controller/ai-faq.controller.js";

// @route: GET /api/comment/post/:postId/suggested-replies
CommentRouter.get("/post/:postId/suggested-replies", authMiddleware, getSuggestedReplies);

// @route: POST /api/comment/:commentId/approve
CommentRouter.post("/:commentId/approve", authMiddleware, approveSuggestedReply);

// @route: POST /api/comment/:commentId/reject
CommentRouter.post("/:commentId/reject", authMiddleware, rejectSuggestedReply);



// @route: POST /api/comment/:postId
// @desc: Create a new comment
// @access: Private
CommentRouter.post("/post/:postId",authMiddleware,commentController)


// @route: GET /api/comment/:postId
// @desc: Get all comments
// @access: Public
CommentRouter.get("/post/:postId",getCommentController)

// @route: GET /api/comment/post/:postId/vibe
// @desc: Get vibe check for comments
// @access: Public
CommentRouter.get("/post/:postId/vibe", getVibeController)


// @route: GET /api/comment/:commentId
// @desc: Get single comment
// @access: Public
CommentRouter.get("/:commentId",getSingleCommentController)


// @route: PATCH /api/comment/:commentId
// @desc: Update a comment
// @access: Private
CommentRouter.patch("/:commentId",authMiddleware,updateCommentController)



// @route: DELETE /api/comment/:commentId
// @desc: Delete a comment
// @access: Private
CommentRouter.delete("/:commentId",authMiddleware,deleteCommentController)

export default CommentRouter