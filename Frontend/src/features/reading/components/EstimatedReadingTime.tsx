import { Clock } from "lucide-react";

interface EstimatedReadingTimeProps {
  words: number;
  className?: string;
}

export const EstimatedReadingTime = ({ words, className = "" }: EstimatedReadingTimeProps) => {
  // Average reading speed is roughly 200-250 words per minute
  const wpm = 225;
  const minutes = Math.ceil(words / wpm);

  return (
    <div className={`flex items-center gap-1.5 text-muted-foreground text-sm ${className}`}>
      <Clock className="w-4 h-4" />
      <span>{minutes} min read</span>
    </div>
  );
};
