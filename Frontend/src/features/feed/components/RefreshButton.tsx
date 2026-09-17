import { RefreshCw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { refreshFeedThunk } from "../state/feedSlice";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

interface RefreshButtonProps {
  className?: string;
}

export function RefreshButton({ className }: RefreshButtonProps) {
  const dispatch = useAppDispatch();
  const refreshing = useAppSelector((state) => state.feed.refreshing);

  const handleRefresh = () => {
    dispatch(refreshFeedThunk());
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      disabled={refreshing}
      className={cn(
        "rounded-full gap-2 border-border bg-card/40 hover:bg-muted text-foreground transition-all duration-300",
        className
      )}
    >
      <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin text-primary")} />
      <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
    </Button>
  );
}
