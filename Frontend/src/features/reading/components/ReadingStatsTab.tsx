import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { setReadingData } from "../state/readingSlice";
import { readingService } from "../services/reading.service";
import { ReadingGoalCard } from "./ReadingGoalCard";
import { ReadingStreakCard } from "./ReadingStreakCard";
import { AchievementCard } from "./AchievementCard";
import { ContinueReadingCard } from "@/features/recommendation/components/ContinueReadingCard";
import { ReadingHistoryItem } from "../types";

export const ReadingStatsTab = () => {
  const dispatch = useAppDispatch();
  const { goal, streak, achievements, history } = useAppSelector((state) => state.reading);

  useEffect(() => {
    const loadStats = async () => {
      const data = await readingService.getReadingData();
      dispatch(setReadingData(data));
    };
    loadStats();
  }, [dispatch]);

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReadingStreakCard streak={streak} />
        <ReadingGoalCard goal={goal} />
      </div>

      <div>
        <h3 className="font-bold text-xl mb-6">Achievements</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-xl mb-6">Recently Read</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item: ReadingHistoryItem) => (
            <ContinueReadingCard 
              key={item.postId} 
              data={{
                postId: item.postId,
                title: item.title,
                author: item.author,
                progressPercentage: item.completionPercentage,
                estimatedTimeLeft: 0,
                lastReadAt: item.readAt
              }} 
            />
          ))}
          {history.length === 0 && (
            <div className="col-span-full py-10 text-center text-muted-foreground border border-dashed rounded-2xl">
              No reading history yet. Start exploring articles!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
