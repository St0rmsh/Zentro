import { motion } from "framer-motion";
import { ReadingGoal } from "../types";
import { Target, BookOpen, Clock } from "lucide-react";

interface ReadingGoalCardProps {
  goal: ReadingGoal;
}

export const ReadingGoalCard = ({ goal }: ReadingGoalCardProps) => {
  const timeProgress = Math.min(100, (goal.currentDailyMinutes / goal.dailyMinutes) * 100);
  const articleProgress = Math.min(100, (goal.currentWeeklyArticles / goal.weeklyArticles) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-lg leading-tight">Reading Goals</h3>
          <p className="text-sm text-muted-foreground">Track your reading habits</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-end mb-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Daily Time
            </div>
            <div className="text-sm">
              <span className="font-bold">{goal.currentDailyMinutes}</span>
              <span className="text-muted-foreground"> / {goal.dailyMinutes} min</span>
            </div>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${timeProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              Weekly Articles
            </div>
            <div className="text-sm">
              <span className="font-bold">{goal.currentWeeklyArticles}</span>
              <span className="text-muted-foreground"> / {goal.weeklyArticles}</span>
            </div>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${articleProgress}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
