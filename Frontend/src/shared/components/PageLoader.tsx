import { Loader2 } from "lucide-react";

export function PageLoader({ fullScreen = false }: { fullScreen?: boolean }) {
  return (
    <div className={`flex items-center justify-center ${fullScreen ? "fixed inset-0 bg-background z-50" : "w-full h-full min-h-[400px]"}`}>
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );
}
