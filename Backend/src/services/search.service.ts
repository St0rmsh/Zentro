import PostModel from "../model/post.model.js";
import UserModel from "../model/auth.model.js";

export const searchService = {
  searchPosts: async (searchQuery: string, page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const filter = searchQuery
      ? {
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { content: { $regex: searchQuery, $options: "i" } },
          { tags: { $regex: searchQuery, $options: "i" } },
        ],
        isPublished: true,
      }
      : { isPublished: true };

    const [posts, total] = await Promise.all([
      PostModel.find(filter)
        .populate("user", "username fullname avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      PostModel.countDocuments(filter),
    ]);

    return {
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      limit,
      hasNextPage: page * limit < total,
    };
  },

  searchUsers: async (searchQuery: string, page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const filter = searchQuery
      ? {
        $or: [
          { username: { $regex: searchQuery, $options: "i" } },
          { fullname: { $regex: searchQuery, $options: "i" } },
        ],
        isActive: true,
      }
      : { isActive: true };

    const [users, total] = await Promise.all([
      UserModel.find(filter)
        .select("username fullname avatar bio postCount roles")
        .skip(skip)
        .limit(limit)
        .lean(),
      UserModel.countDocuments(filter),
    ]);

    return {
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      limit,
      hasNextPage: page * limit < total,
    };
  },

  searchTags: async (searchQuery: string, limit: number) => {
    const filter = searchQuery
      ? { tags: { $regex: searchQuery, $options: "i" }, isPublished: true }
      : { isPublished: true };

    const tagsAggr = await PostModel.aggregate([
      { $match: filter },
      { $unwind: "$tags" },
      ...(searchQuery ? [{ $match: { tags: { $regex: searchQuery, $options: "i" } } }] : []),
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);

    const tags = tagsAggr.map((t) => ({ name: t._id, count: t.count }));

    return { tags };
  },

  getDiscover: async () => {
    const aiUser = await UserModel.findOne({ email: "ai.system@zentro.com" }).select("_id").lean();

    let [trendingPosts, topUsers, trendingTags] = await Promise.all([
      PostModel.find({ isPublished: true })
        .populate("user", "username fullname avatar")
        .sort({ viewsCount: -1, likesCount: -1 })
        .limit(6)
        .lean(),
      UserModel.find({ isActive: true })
        .sort({ postCount: -1 })
        .select("username fullname avatar bio postCount")
        .limit(5)
        .lean(),
      PostModel.aggregate([
        { $match: { isPublished: true } },
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]).then((tags) => tags.map((t) => ({ name: t._id, count: t.count }))),
    ]);

    // Ensure the latest AI post is always available on the Explore page
    if (aiUser) {
      const aiPost = await PostModel.findOne({ user: aiUser._id, isPublished: true })
        .populate("user", "username fullname avatar")
        .sort({ createdAt: -1 })
        .lean();
      
      if (aiPost) {
        const exists = trendingPosts.some(p => p._id.toString() === aiPost._id.toString());
        if (!exists) {
          trendingPosts.unshift(aiPost);
          if (trendingPosts.length > 6) {
            trendingPosts.pop();
          }
        }
      }
    }

    return {
      trendingPosts,
      topUsers,
      trendingTags,
    };
  },
};
