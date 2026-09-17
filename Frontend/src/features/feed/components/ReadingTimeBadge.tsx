import { BookOpen } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ReadingTimeBadgeProps {
  content?: string;
  minutes?: number;
  className?: string;
}

export function ReadingTimeBadge({ content, minutes, className }: ReadingTimeBadgeProps) {
  const displayMinutes = (() => {
    if (minutes !== undefined) return minutes;
    if (!content) return 1;
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  })();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-muted-foreground/80 bg-muted/30 border border-border/30 px-2 py-0.5 rounded-md",
        className
      )}
    >
      <BookOpen className="w-3.5 h-3.5 text-primary/70" />
      <span>{displayMinutes} min read</span>
    </div>
  );
}
