import { ErrorState } from "@/shared/components/ErrorState";

interface FeedErrorProps {
  message: string;
  onRetry: () => void;
}

export function FeedError({ message, onRetry }: FeedErrorProps) {
  return <ErrorState message={message} onRetry={onRetry} />;
}
