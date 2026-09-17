import { motion } from "framer-motion";
import { Achievement } from "../types";
import { Award, Star, Flame, BookOpen, Trophy } from "lucide-react";

interface AchievementCardProps {
  achievement: Achievement;
}

const iconMap: Record<string, React.ReactNode> = {
  book: <BookOpen className="w-6 h-6" />,
  star: <Star className="w-6 h-6" />,
  flame: <Flame className="w-6 h-6" />,
  award: <Award className="w-6 h-6" />,
  trophy: <Trophy className="w-6 h-6" />,
};

export const AchievementCard = ({ achievement }: AchievementCardProps) => {
  const isUnlocked = achievement.isUnlocked;
  
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className={`relative p-5 rounded-2xl border transition-all duration-300 overflow-hidden flex items-center gap-4 ${
        isUnlocked 
          ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-sm' 
          : 'bg-muted/30 border-border/50 grayscale opacity-60'
      }`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-inner ${
        isUnlocked ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
      }`}>
        {iconMap[achievement.icon] || <Award className="w-6 h-6" />}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className={`font-bold text-base truncate ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
          {achievement.title}
        </h4>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
          {achievement.description}
        </p>
        
        {!isUnlocked && achievement.maxProgress && achievement.progress !== undefined && (
          <div className="mt-3 w-full max-w-[200px]">
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1 font-medium">
              <span>Progress</span>
              <span>{achievement.progress} / {achievement.maxProgress}</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-muted-foreground/40 rounded-full"
                style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {isUnlocked && achievement.unlockedAt && (
        <div className="absolute top-3 right-3 text-[10px] font-medium text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">
          Unlocked
        </div>
      )}
    </motion.div>
  );
};
