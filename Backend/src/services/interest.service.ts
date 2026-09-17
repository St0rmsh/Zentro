import UserInterestModel from "../model/userInterest.model.js";
import PostModel from "../model/post.model.js";

export const updateUserInterestService = async (
  userId: string,
  postId: string,
  weight = 1
) => {
  const post = await PostModel.findById(postId);

  if (!post) return;

  let interest =
    await UserInterestModel.findOne({
      user: userId
    });

  if (!interest) {
    interest =
      await UserInterestModel.create({
        user: userId,
        categories: [],
        tags: []
      });
  }

  // CATEGORY

  const categoryIndex =
    interest.categories.findIndex(
      (c) =>
        (c.name ?? "").toLowerCase() ===
        (post.category ?? "").toLowerCase()
    );

  if (categoryIndex >= 0) {
  const category = interest.categories[categoryIndex];

  if (category) {
    category.score = Math.max(0,Math.min(category.score + weight,100)) ;
  }
} else {
    interest.categories.push({
  name: post.category,
  score: Math.max(0, weight)
});
  }

  // TAGS

 for (const tag of post.tags ?? []) {

  if (!tag) continue;

  const tagIndex =
    interest.tags.findIndex(
      (t) =>
        (t.name ?? "").toLowerCase() ===
        tag.toLowerCase()
    );

 if (tagIndex >= 0) {
  const existingTag = interest.tags[tagIndex];

  if (existingTag) {
existingTag.score = Math.max(0,Math.min(existingTag.score + weight,100))  }
} else {
  interest.tags.push({
    name: tag,
    score: Math.max(0, weight)
});
  }
}

  await interest.save();
};