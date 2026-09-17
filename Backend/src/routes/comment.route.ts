import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { commentController, deleteCommentController, getCommentController, getSingleCommentController, updateCommentController, getVibeController } from "../controller/comment.controller.js";


const CommentRouter = Router()


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