import {Router} from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { bookmarkController, getMyBookmarksController } from "../controller/bookmark.controller.js";


const router = Router()



// @route POST api/bookmark/:postId
// @desc Bookmark a post
// @access Private
router.post("/:postId",authMiddleware,bookmarkController)


// @route GET api/bookmark
// @desc Get my bookmarks
// @access Private
router.get("/",authMiddleware ,getMyBookmarksController)

export default router