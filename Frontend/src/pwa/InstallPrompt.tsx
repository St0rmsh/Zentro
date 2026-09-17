import { useState } from "react";
import { Download, X } from "lucide-react";
import { useAppSelector } from "@/shared/hooks";
import { Button } from "@/shared/ui/button";
import { promptInstall } from "./usePwaStatus";

const DISMISSED_KEY = "zentro_install_prompt_dismissed";

export function InstallPrompt() {
  const canInstall = useAppSelector((state) => state.pwa.canInstall);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISSED_KEY) === "true");

  if (!canInstall || dismissed) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setDismissed(true);
  };

  const install = async () => {
    const accepted = await promptInstall();
    if (accepted) setDismissed(true);
  };

  return (
    <aside className="fixed bottom-20 left-4 right-4 z-50 mx-auto flex max-w-md items-center gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-xl md:bottom-6">
      <Download className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      <p className="flex-1 text-sm font-medium">Install Zentro for faster access and offline reading.</p>
      <Button size="sm" onClick={install}>Install</Button>
      <Button size="icon" variant="ghost" onClick={dismiss} aria-label="Dismiss install prompt">
        <X aria-hidden="true" />
      </Button>
    </aside>
  );
}
