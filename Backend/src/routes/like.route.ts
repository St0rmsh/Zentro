import {Router} from "express"
import { authMiddleware } from "../middleware/auth.middleware.js"
import { LikeController } from "../controller/Like.controller.js"

const likeRouter = Router()


// @route: POST /api/like/:postId
// @desc: Like a post
// @access: Private
likeRouter.post("/:postId",authMiddleware,LikeController)

export default likeRouter