import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { followUserController, getAllFollowersController, getAllFollowingController, getFollowStatusController, unfollowUserController } from "../controller/Followers.controller.js";


const followersRouter = Router();


// @route POST /api/v1/followers/:userId
// @desc Follow a user
// @access Private
followersRouter.post("/:userId", authMiddleware, followUserController);




// @route POST /api/v1/followers/unfollow/:userId
// @desc Unfollow a user
// @access Private
followersRouter.post("/unfollow/:userId", authMiddleware,unfollowUserController );



// @route GET /api/v1/followers/followers/:userId
// @desc Get all followers of a user
// @access Private

followersRouter.get("/followers/:userId", authMiddleware, getAllFollowersController);


// @route GET /api/v1/followers/followers/:userId
// @desc Get all following of a user
// @access Private

followersRouter.get("/following/:userId", authMiddleware, getAllFollowingController);



followersRouter.get("/status/:userId", authMiddleware, getFollowStatusController );


export default followersRouter;