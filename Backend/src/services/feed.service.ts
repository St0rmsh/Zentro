import { Types } from "mongoose";
import PostModel from "../model/post.model.js";
import UserInterestModel from "../model/userInterest.model.js";
import FollowerModel from "../model/Follower.model.js";
import type { PipelineStage } from "mongoose";
import UserModel from "../model/auth.model.js";

const buildFeedPipeline = (
  matchStage: Record<string, any>,
  skip: number,
  limit: number
): PipelineStage[] => [
    {
      $match: matchStage,
    },

    {
      $addFields: {
        ageHours: {
          $divide: [
            {
              $subtract: [new Date(), "$createdAt"],
            },
            1000 * 60 * 60,
          ],
        },
      },
    },

    {
      $addFields: {
        score: {
          $subtract: [
            {
              $add: [
                {
                  $multiply: [
                    {
                      $ifNull: ["$likesCount", 0],
                    },
                    5,
                  ],
                },

                {
                  $multiply: [
                    {
                      $ifNull: ["$commentsCount", 0],
                    },
                    10,
                  ],
                },

                {
                  $multiply: [
                    {
                      $ifNull: ["$viewsCount", 0],
                    },
                    0.1,
                  ],
                },
              ],
            },

            {
              $multiply: ["$ageHours", 0.1],
            },
          ],
        },
      },
    },

    {
      $sort: {
        score: -1,
        createdAt: -1,
      },
    },

    {
      $skip: skip,
    },

    {
      $limit: limit,
    },

    {
      $lookup: {
        from: "users",
        let: {
          userId: "$user",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$userId"],
              },
            },
          },

          {
            $project: {
              username: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
        as: "user",
      },
    },

    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $project: {
        _id: 1,
        title: 1,
        content: 1,
        coverImage: 1,
        mediaUrl: 1,
        mediaType: 1,
        category: 1,
        tags: 1,
        likesCount: 1,
        commentsCount: 1,
        viewsCount: 1,
        createdAt: 1,
        updatedAt: 1,
        score: 1,

        "user._id": 1,
        "user.username": 1,
        "user.fullname": 1,
        "user.avatar": 1,
      },
    },
  ];


export const getFeedService = async (userId: string, page: number, limit: number, tab: string = "home") => {

  try {

    const safePage = Math.max(1, page);
    const safeLimit = Math.min(50, Math.max(1, limit));

    const skip = (safePage - 1) * safeLimit;

    // Fetch the AI system user to inject its posts into the feed
    const aiUser = await UserModel.findOne({ email: "ai.system@zentro.com" }).select("_id").lean();
    const aiUserId = aiUser?._id;

    const userInterest = await UserInterestModel.findOne({
      user: userId
    }).lean();

    const topCategories = userInterest?.categories
      ?.sort((a, b) => b.score - a.score)
      ?.slice(0, 5)
      ?.map((c) => c.name)
      ?.filter(Boolean) || [];

    const topTags =
      userInterest?.tags
        ?.sort((a, b) => b.score - a.score)
        ?.slice(0, 10)
        ?.map((t) => t.name)
        ?.filter(Boolean) || [];


    const following = await FollowerModel.find({ followerId: userId })
      .select("followingId")
      .lean();

    const followingIds = following.map(
      (f) => new Types.ObjectId(f.followingId.toString())
    );

    const hasPersonalization =
      followingIds.length > 0 ||
      topCategories.length > 0 ||
      topTags.length > 0;

    let matchStage: any = {
      isPublished: true,
      user: {
        $ne: new Types.ObjectId(userId)
      },
      createdAt: {
        $gte: new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000
        )
      }
    };

    if (tab === "following") {
      matchStage.user = { $in: followingIds };
    } else if (tab === "recommended") {
      const excludeUsers = [...followingIds, new Types.ObjectId(userId)];
      matchStage.user = { $nin: excludeUsers };
      if (topCategories.length > 0 || topTags.length > 0) {
        matchStage.$or = [
          ...(topCategories.length > 0 ? [{ category: { $in: topCategories } }] : []),
          ...(topTags.length > 0 ? [{ tags: { $in: topTags } }] : [])
        ];
      }
    } else if (tab === "trending") {
      // Base matchStage applies (all published recent posts, not self)
    } else {
      // Default "home"
      if (hasPersonalization || aiUserId) {
        matchStage.$or = [
          ...(topCategories.length > 0 ? [{ category: { $in: topCategories } }] : []),
          ...(topTags.length > 0 ? [{ tags: { $in: topTags } }] : []),
          ...(followingIds.length > 0 ? [{ user: { $in: followingIds } }] : []),
          ...(aiUserId ? [{ user: aiUserId }] : [])
        ];
      }
    }

    const [posts, totalPosts] =
      await Promise.all([
        PostModel.aggregate(
          buildFeedPipeline(matchStage, skip, safeLimit)
        ),
        PostModel.countDocuments(matchStage)
      ]);

    let finalPosts = posts;
    let finalTotalPosts = totalPosts;

    if (tab === "home" && hasPersonalization && posts.length === 0) {
      const fallbackMatch = {
        isPublished: true,
        user: {
          $ne: new Types.ObjectId(userId)
        },
        createdAt: {
          $gte: new Date(
            Date.now() - 30 * 24 * 60 * 60 * 1000
          )
        }
      };

      const [fallbackPosts, fallbackTotal] =
        await Promise.all([
          PostModel.aggregate(buildFeedPipeline(fallbackMatch, skip, safeLimit)),

          PostModel.countDocuments(
            fallbackMatch
          )
        ]);

      finalPosts = fallbackPosts;
      finalTotalPosts = fallbackTotal;
    }

    const totalPages = Math.max(1, Math.ceil(finalTotalPosts / safeLimit));
    return {
      posts: finalPosts,
      totalPosts: finalTotalPosts,
      currentPage: safePage,
      totalPages,
      limit: safeLimit,
      hasNextPage: safePage < totalPages,
      hasPrevPage: safePage > 1
    };

  } catch (error) {
    console.error(
      "Error in feed service:",
      error
    );

    throw new Error(
      error instanceof Error
        ? error.message
        : "Unknown error"
    );

  }
}

