import { useNavigate } from "react-router-dom";
import { CloudOff, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";

export function OfflinePage() {
  const navigate = useNavigate();

  const retry = () => {
    if (navigator.onLine) {
      navigate(-1);
      return;
    }
    window.location.reload();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground">
      <section className="w-full max-w-lg text-center" aria-labelledby="offline-title">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <CloudOff className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
        </div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Zentro</p>
        <h1 id="offline-title" className="text-3xl font-bold tracking-tight">You are offline</h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Previously opened posts remain available. Reconnect to continue browsing your feed.
        </p>
        <Button className="mt-8" onClick={retry}>
          <RefreshCw aria-hidden="true" />
          Try again
        </Button>
      </section>
    </main>
  );
}
