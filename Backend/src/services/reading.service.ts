import mongoose from "mongoose";
import ReadingProgressModel from "../model/readingProgress.model.js";
import ReadingActivityModel from "../model/readingActivity.model.js";

/* ============================================================
   CONSTANTS
============================================================ */

const DAILY_MINUTES_GOAL = 30;
const WEEKLY_ARTICLES_GOAL = 5;
const COMPLETION_THRESHOLD = 90;

const MAX_SYNC_SECONDS = 600;
const HISTORY_LIMIT = 6;
const DAYS_IN_WEEK = 7;
const DAY_MS = 86_400_000;
const MONGO_DUPLICATE_KEY = 11000;

/* ============================================================
   TYPES
============================================================ */

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

interface HistoryItem {
  postId: string;
  title: string;
  author: string;
  category: string;
  completionPercentage: number;
  readAt: string;
}

export interface ReadingStats {
  goal: {
    dailyMinutes: number;
    weeklyArticles: number;
    currentDailyMinutes: number;
    currentWeeklyArticles: number;
    lastUpdated: string;
  };
  streak: {
    currentStreak: number;
    longestStreak: number;
    lastReadDate: string;
    weeklyActivity: boolean[];
  };
  achievements: Achievement[];
  history: HistoryItem[];
}

/* ============================================================
   HELPERS
============================================================ */

const clamp = (value: number, min: number, max: number): number =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min;

const toDateKey = (date: Date): string => date.toISOString().slice(0, 10);

const toDayNumber = (dateKey: string): number =>
  Math.floor(Date.parse(`${dateKey}T00:00:00.000Z`) / DAY_MS);

const getMondayOfWeek = (date: Date): Date => {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  const day = d.getUTCDay(); // 0 = Sun .. 6 = Sat
  const diffToMonday = day === 0 ? 6 : day - 1;
  d.setUTCDate(d.getUTCDate() - diffToMonday);
  return d;
};

const isDuplicateKeyError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as { code?: unknown }).code === MONGO_DUPLICATE_KEY;

/*
 * Two requests can upsert the same (user, key) at the same moment.
 * One of them gets a duplicate-key error. Retrying once turns it into
 * a normal update instead of a failed request.
 */
const withUpsertRetry = async <T>(operation: () => Promise<T>): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (isDuplicateKeyError(error)) return operation();
    throw error;
  }
};

/*
 * Calculates both streaks in a single pass over sorted date keys
 * ("YYYY-MM-DD", ascending).
 *
 * The current streak counts only if the latest reading day is today
 * or yesterday, so a streak is not lost before the day is over.
 */
const calculateStreaks = (
  sortedDateKeys: string[],
  todayKey: string
): { currentStreak: number; longestStreak: number } => {
  let longestStreak = 0;
  let run = 0;
  let previousDay: number | null = null;

  for (const dateKey of sortedDateKeys) {
    const day = toDayNumber(dateKey);

    if (!Number.isFinite(day) || day === previousDay) continue;

    run = previousDay !== null && day - previousDay === 1 ? run + 1 : 1;
    longestStreak = Math.max(longestStreak, run);
    previousDay = day;
  }

  const isRunStillActive =
    previousDay !== null && toDayNumber(todayKey) - previousDay <= 1;

  return {
    currentStreak: isRunStillActive ? run : 0,
    longestStreak,
  };
};

const buildAchievements = (
  totalCompleted: number,
  currentStreak: number,
  longestStreak: number,
  firstCompletedAt?: string
): Achievement[] => {
  const firstRead: Achievement = {
    id: "first-read",
    title: "First Read",
    description: "Read your first article",
    icon: "book",
    isUnlocked: totalCompleted >= 1,
  };

  if (firstRead.isUnlocked && firstCompletedAt) {
    firstRead.unlockedAt = firstCompletedAt;
  }

  const isWeekWarrior = currentStreak >= 7 || longestStreak >= 7;

  return [
    firstRead,
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
      isUnlocked: isWeekWarrior,
      // An unlocked badge always shows full progress, even if the
      // current streak was reset later.
      progress: isWeekWarrior ? 7 : Math.min(currentStreak, 7),
      maxProgress: 7,
    },
  ];
};

/* ============================================================
   SYNC PROGRESS
   Called periodically (heartbeat) and on unmount from the reader
   page. Upserts the per-post progress record and today's activity
   record.
============================================================ */

export const syncReadingProgressService = async (
  userId: string,
  postId: string,
  percentage: number,
  secondsSpent: number
) => {
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new Error("Invalid post ID");
  }

  const safePercentage = clamp(percentage, 0, 100);
  // Cap a single sync's time contribution as a safety net against
  // clock or tab-switch weirdness.
  const safeSeconds = clamp(secondsSpent, 0, MAX_SYNC_SECONDS);

  const now = new Date();

  // 1. One atomic write for the progress record. No read-before-write,
  //    so concurrent heartbeats cannot work from stale data.
  const progress = await withUpsertRetry(() =>
    ReadingProgressModel.findOneAndUpdate(
      { user: userId, post: postId },
      {
        $max: { maxPercentage: safePercentage },
        $inc: { timeSpentSeconds: safeSeconds },
        $set: { lastReadAt: now },
        $setOnInsert: { firstReadAt: now },
      },
      { upsert: true, new: true }
    ).lean()
  );

  if (!progress) {
    throw new Error("Failed to save reading progress");
  }

  // 2. Claim the completion atomically. The filter only matches while
  //    completedAt is unset, so when several requests cross the
  //    threshold together, exactly one of them gets modifiedCount === 1.
  let justCompleted = false;

  if (progress.maxPercentage >= COMPLETION_THRESHOLD && !progress.completedAt) {
    const claim = await ReadingProgressModel.updateOne(
      { _id: progress._id, completedAt: { $exists: false } },
      { $set: { completedAt: now } }
    );

    justCompleted = claim.modifiedCount === 1;
  }

  // 3. Today's activity record.
  const dateKey = toDateKey(now);

  await withUpsertRetry(() =>
    ReadingActivityModel.updateOne(
      { user: userId, date: dateKey },
      {
        $inc: { minutesSpent: safeSeconds / 60 },
        ...(justCompleted
          ? { $addToSet: { completedPostIds: new mongoose.Types.ObjectId(postId) } }
          : {}),
      },
      { upsert: true }
    )
  );

  return justCompleted ? { ...progress, completedAt: now } : progress;
};

/* ============================================================
   READING STATS
============================================================ */

export const getReadingStatsService = async (
  userId: string
): Promise<ReadingStats> => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const now = new Date();
  const todayKey = toDateKey(now);

  const monday = getMondayOfWeek(now);
  const weekDateKeys = Array.from({ length: DAYS_IN_WEEK }, (_, i) => {
    const day = new Date(monday);
    day.setUTCDate(monday.getUTCDate() + i);
    return toDateKey(day);
  });
  const weekStartKey = weekDateKeys[0] ?? toDateKey(monday);

  // All independent queries run in parallel.
  const [
    allDateDocs,
    weekDocs,
    totalCompleted,
    firstCompleted,
    historyDocs,
  ] = await Promise.all([
    // Streaks need every reading day, but only the date string, so this
    // stays small even for years of history.
    ReadingActivityModel.find({ user: userObjectId })
      .select("date -_id")
      .sort({ date: 1 })
      .lean(),

    // Heavier fields (minutes, completed ids) are needed only for this week.
    ReadingActivityModel.find({
      user: userObjectId,
      date: { $gte: weekStartKey },
    })
      .select("date minutesSpent completedPostIds")
      .lean(),

    ReadingProgressModel.countDocuments({
      user: userObjectId,
      completedAt: { $exists: true },
    }),

    ReadingProgressModel.findOne({
      user: userObjectId,
      completedAt: { $exists: true },
    })
      .sort({ completedAt: 1 })
      .select("completedAt")
      .lean(),

    ReadingProgressModel.find({ user: userObjectId })
      .sort({ lastReadAt: -1 })
      .limit(HISTORY_LIMIT)
      .populate({
        path: "post",
        select: "title category user",
        populate: { path: "user", select: "username" },
      })
      .lean(),
  ]);

  // --- Streaks ---
  const sortedDateKeys = allDateDocs.map((doc) => doc.date);
  const { currentStreak, longestStreak } = calculateStreaks(
    sortedDateKeys,
    todayKey
  );

  // --- This week (Mon..Sun) ---
  const weekDocsByDate = new Map(weekDocs.map((doc) => [doc.date, doc]));
  const weeklyCompletedPostIds = new Set<string>();

  const weeklyActivity = weekDateKeys.map((dateKey) => {
    const doc = weekDocsByDate.get(dateKey);
    doc?.completedPostIds?.forEach((id) =>
      weeklyCompletedPostIds.add(id.toString())
    );
    return Boolean(doc);
  });

  const currentDailyMinutes = Math.round(
    weekDocsByDate.get(todayKey)?.minutesSpent ?? 0
  );

  // --- Achievements ---
  const achievements = buildAchievements(
    totalCompleted,
    currentStreak,
    longestStreak,
    firstCompleted?.completedAt?.toISOString()
  );

  // --- Recently read history ---
  const history: HistoryItem[] = [];

  for (const doc of historyDocs) {
    if (!doc.post) continue;

    const post = doc.post as unknown as {
      _id: mongoose.Types.ObjectId;
      title: string;
      category: string;
      user?: { username: string };
    };

    history.push({
      postId: post._id.toString(),
      title: post.title,
      author: post.user?.username ?? "unknown",
      category: post.category,
      completionPercentage: Math.round(doc.maxPercentage),
      readAt: doc.lastReadAt.toISOString(),
    });
  }

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
      lastReadDate: sortedDateKeys[sortedDateKeys.length - 1] ?? "",
      weeklyActivity,
    },
    achievements,
    history,
  };
};