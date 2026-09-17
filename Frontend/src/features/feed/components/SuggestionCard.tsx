import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

interface SuggestionCardProps {
  avatar?: string;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function SuggestionCard({
  avatar,
  title,
  subtitle,
  actionLabel,
  onAction,
  className
}: SuggestionCardProps) {
  return (
    <div className={cn("flex items-center justify-between gap-3 py-2.5", className)}>
      <div className="flex items-center gap-3 min-w-0">
        {avatar ? (
          <img
            src={avatar}
            alt={title}
            className="w-9 h-9 rounded-full object-cover border border-border/40"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm border border-border/40">
            {title.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold hover:underline cursor-pointer truncate text-foreground leading-none">
            {title}
          </span>
          <span className="text-[11px] text-muted-foreground mt-1 truncate">
            {subtitle}
          </span>
        </div>
      </div>
      {actionLabel && onAction && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onAction}
          className="h-7 rounded-full text-[11px] px-3 font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-200"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
