import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

interface ReadingProgressBarProps {
  progress: number;
  className?: string;
}

export function ReadingProgressBar({ progress, className }: ReadingProgressBarProps) {
  return (
    <div className={cn("w-full h-1 bg-muted/30 overflow-hidden relative", className)}>
      <motion.div
        className="h-full bg-primary"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </div>
  );
}
