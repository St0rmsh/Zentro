import { motion } from "framer-motion";
import { ReadingStreak } from "../types";
import { Flame } from "lucide-react";

interface ReadingStreakCardProps {
  streak: ReadingStreak;
}

export const ReadingStreakCard = ({ streak }: ReadingStreakCardProps) => {
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const activeDays = streak.weeklyActivity ?? [false, false, false, false, false, false, false];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 relative z-10">
            <Flame className="w-7 h-7" />
          </div>
          {streak.currentStreak > 0 && (
            <motion.div 
              className="absolute inset-0 rounded-full border-2 border-rose-500/30"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <h3 className="text-3xl font-black text-rose-500">{streak.currentStreak}</h3>
            <span className="font-bold text-foreground">Day Streak</span>
          </div>
          <p className="text-sm text-muted-foreground">Longest streak: {streak.longestStreak} days</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">This Week</p>
        <div className="flex justify-between items-center">
          {weekDays.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                activeDays[i] ? 'bg-rose-500 text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {activeDays[i] ? <Flame className="w-4 h-4" /> : null}
              </div>
              <span className="text-xs font-medium text-muted-foreground">{day}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};