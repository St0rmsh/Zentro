import mongoose from "mongoose";
import ReadingProgressModel from "../model/readingProgress.model.js";
import ReadingActivityModel from "../model/readingActivity.model.js";

const DAILY_MINUTES_GOAL = 30;
const WEEKLY_ARTICLES_GOAL = 5;
const COMPLETION_THRESHOLD = 90;

const toDateKey = (date: Date) => date.toISOString().slice(0, 10);

const getMondayOfWeek = (date: Date) => {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay(); // 0 = Sun .. 6 = Sat
  const diffToMonday = day === 0 ? 6 : day - 1;
  d.setUTCDate(d.getUTCDate() - diffToMonday);
  return d;
};

// Called periodically (heartbeat) and on unmount from the reader page.
// Upserts both the per-post progress record and today's activity record.

export const syncReadingProgressService = async (userId: string, postId: string, percentage: number, secondsSpent: number) => {
  if (!mongoose.Types.ObjectId.isValid(postId)) throw new Error("Invalid post ID");

  const safePercentage = Math.min(100, Math.max(0, percentage));
  // Cap a single sync's time contribution as a safety net against clock/tab-switch weirdness
  const safeSeconds = Math.min(600, Math.max(0, secondsSpent));

  const now = new Date();

  const existing = await ReadingProgressModel.findOne({ user: userId, post: postId }).lean();
  const wasCompleted = Boolean(existing?.completedAt);
  const newMaxPercentage = Math.max(existing?.maxPercentage ?? 0, safePercentage);
  const justCompleted = !wasCompleted && newMaxPercentage >= COMPLETION_THRESHOLD;

  const progress = await ReadingProgressModel.findOneAndUpdate(
    { user: userId, post: postId },
    {
      $max: { maxPercentage: safePercentage },
      $inc: { timeSpentSeconds: safeSeconds },
      $set: { lastReadAt: now, ...(justCompleted ? { completedAt: now } : {}) },
      $setOnInsert: { firstReadAt: now },
    },
    { upsert: true, new: true }
  );

  const dateKey = toDateKey(now);
  await ReadingActivityModel.findOneAndUpdate(
    { user: userId, date: dateKey },
    {
      $inc: { minutesSpent: safeSeconds / 60 },
      ...(justCompleted ? { $addToSet: { completedPostIds: new mongoose.Types.ObjectId(postId) } } : {}),
    },
    { upsert: true, new: true }
  );

  return progress;
};



export const getReadingStatsService = async (userId: string) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const now = new Date();

  const activityDocs = await ReadingActivityModel.find({ user: userObjectId }).sort({ date: -1 }).lean();
  const activityByDate = new Map(activityDocs.map((doc) => [doc.date, doc]));

  // --- Current streak: walk backward from today (or yesterday, if today has no activity yet) ---
  let currentStreak = 0;
  const cursor = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  if (!activityByDate.has(toDateKey(cursor))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  while (activityByDate.has(toDateKey(cursor))) {
    currentStreak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  // --- Longest streak: longest run of consecutive calendar days in the full history ---
  let longestStreak = 0;
  let running = 0;
  let prevDate: Date | null = null;
  const sortedDates = [...activityByDate.keys()].sort();
  for (const dateKey of sortedDates) {
    const current = new Date(`${dateKey}T00:00:00.000Z`);
    if (prevDate) {
      const dayDiff = Math.round((current.getTime() - prevDate.getTime()) / 86400000);
      running = dayDiff === 1 ? running + 1 : 1;
    } else {
      running = 1;
    }
    longestStreak = Math.max(longestStreak, running);
    prevDate = current;
  }
  longestStreak = Math.max(longestStreak, currentStreak);

  // --- This week's activity calendar (Mon..Sun) + weekly completed-article count ---
  const monday = getMondayOfWeek(now);
  const weeklyActivity: boolean[] = [];
  const weeklyCompletedPostIds = new Set<string>();
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setUTCDate(monday.getUTCDate() + i);
    const doc = activityByDate.get(toDateKey(day));
    weeklyActivity.push(Boolean(doc));
    doc?.completedPostIds?.forEach((id) => weeklyCompletedPostIds.add(id.toString()));
  }

  // --- Today's minutes ---
  const todayDoc = activityByDate.get(toDateKey(now));
  const currentDailyMinutes = Math.round(todayDoc?.minutesSpent ?? 0);

  // --- Achievements, derived from real totals ---
  const totalCompleted = await ReadingProgressModel.countDocuments({ user: userObjectId, completedAt: { $exists: true } });

  const achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    isUnlocked: boolean;
    unlockedAt?: string;
    progress?: number;
    maxProgress?: number;
  }> = [
    {
      id: "first-read",
      title: "First Read",
      description: "Read your first article",
      icon: "book",
      isUnlocked: totalCompleted >= 1,
    },
    {
      id: "avid-reader",
      title: "Avid Reader",
      description: "Read 10 articles",
      icon: "star",
      isUnlocked: totalCompleted >= 10,
      progress: Math.min(totalCompleted, 10),
      maxProgress: 10,
    },
    {
      id: "week-warrior",
      title: "Week Warrior",
      description: "Read every day for a week",
      icon: "flame",
      isUnlocked: currentStreak >= 7 || longestStreak >= 7,
      progress: Math.min(currentStreak, 7),
      maxProgress: 7,
    },
  ];

  if (achievements[0] && achievements[0].isUnlocked) {
    const firstCompleted = await ReadingProgressModel.findOne({ user: userObjectId, completedAt: { $exists: true } })
      .sort({ completedAt: 1 })
      .select("completedAt")
      .lean();
    
    const unlockedDate = firstCompleted?.completedAt?.toISOString();
    if (unlockedDate) {
      achievements[0].unlockedAt = unlockedDate;
    }
  }

  // --- Recently read history ---
  const historyDocs = await ReadingProgressModel.find({ user: userObjectId })
    .sort({ lastReadAt: -1 })
    .limit(6)
    .populate({ path: "post", select: "title category user", populate: { path: "user", select: "username" } })
    .lean();

  const history = historyDocs
    .filter((doc) => doc.post)
    .map((doc) => {
      const post = doc.post as unknown as { _id: mongoose.Types.ObjectId; title: string; category: string; user?: { username: string } };
      return {
        postId: post._id.toString(),
        title: post.title,
        author: post.user?.username ?? "unknown",
        category: post.category,
        completionPercentage: Math.round(doc.maxPercentage),
        readAt: doc.lastReadAt.toISOString(),
      };
    });

  return {
    goal: {
      dailyMinutes: DAILY_MINUTES_GOAL,
      weeklyArticles: WEEKLY_ARTICLES_GOAL,
      currentDailyMinutes,
      currentWeeklyArticles: weeklyCompletedPostIds.size,
      lastUpdated: now.toISOString(),
    },
    streak: {
      currentStreak,
      longestStreak,
      lastReadDate: activityDocs[0]?.date ?? "",
      weeklyActivity,
    },
    achievements,
    history,
  };
};