import { Router } from "express";
import {
  searchController,
  searchPostsController,
  searchUsersController,
  searchTagsController,
  discoverController
} from "../controller/search.controller.js";

const searchRouter = Router();

// @route: GET /api/search
// @desc: Global search overview
searchRouter.get("/", searchController);

// @route: GET /api/search/posts
// @desc: Search posts
searchRouter.get("/posts", searchPostsController);

// @route: GET /api/search/users
// @desc: Search users
searchRouter.get("/users", searchUsersController);

// @route: GET /api/search/tags
// @desc: Search tags
searchRouter.get("/tags", searchTagsController);

// @route: GET /api/search/discover
// @desc: Discover overview
searchRouter.get("/discover", discoverController);

export default searchRouter;
