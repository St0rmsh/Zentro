import { AlertCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
      <AlertCircle className="w-12 h-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">{message}</p>
      {onRetry && <Button onClick={onRetry} variant="outline">Try Again</Button>}
    </div>
  );
}
