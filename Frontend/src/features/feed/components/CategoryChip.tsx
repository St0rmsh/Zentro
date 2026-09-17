import { cn } from "@/shared/lib/utils";

interface CategoryChipProps {
  category: string;
  className?: string;
}

export function CategoryChip({ category, className }: CategoryChipProps) {
  const getCategoryStyles = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "ai":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "programming":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "technology":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors duration-200",
        getCategoryStyles(category),
        className
      )}
    >
      {category}
    </span>
  );
}
