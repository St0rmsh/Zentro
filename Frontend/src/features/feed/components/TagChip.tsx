import { cn } from "@/shared/lib/utils";

interface TagChipProps {
  tag: string;
  onClick?: () => void;
  className?: string;
}

export function TagChip({ tag, onClick, className }: TagChipProps) {
  const formattedTag = tag.startsWith("#") ? tag : `#${tag}`;

  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex items-center text-xs text-muted-foreground/95 hover:text-primary transition-colors cursor-pointer select-none bg-secondary/50 px-2 py-0.5 rounded-md",
        onClick && "hover:bg-secondary transition-all",
        className
      )}
    >
      {formattedTag}
    </span>
  );
}
