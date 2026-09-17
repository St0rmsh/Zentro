import { Newspaper } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";

interface FeedEmptyProps {
  onRefresh?: () => void;
}

export function FeedEmpty({ onRefresh }: FeedEmptyProps) {
  return (
    <EmptyState
      icon={Newspaper}
      title="No Posts Yet"
      description="There are no posts in your feed right now. Follow other creators or check back later for new content."
      actionLabel={onRefresh ? "Refresh Feed" : undefined}
      onAction={onRefresh}
    />
  );
}
