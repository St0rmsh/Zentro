import { motion } from "framer-motion";
import { ReadingProgressData } from "../types";
import { PlayCircle, Clock } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface ContinueReadingCardProps {
  data: ReadingProgressData;
}

export const ContinueReadingCard = ({ data }: ContinueReadingCardProps) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm relative overflow-hidden group cursor-pointer"
    >
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-muted">
        <div 
          className="h-full bg-primary rounded-r-full transition-all duration-500"
          style={{ width: `${data.progressPercentage}%` }}
        />
      </div>

      <div className="flex justify-between items-start gap-4 mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-primary mb-1">
            Continue Reading
          </div>
          <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {data.title}
          </h3>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full flex-shrink-0 text-primary">
          <PlayCircle className="w-6 h-6" />
        </Button>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
        <span>By @{data.author}</span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" /> {data.estimatedTimeLeft} min left
        </span>
      </div>
    </motion.div>
  );
};
