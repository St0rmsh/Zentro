import { useEffect } from "react";
import { useAppDispatch } from "@/shared/hooks";
import { setCanInstall, setInstalled, setOnline, setUpdateAvailable } from "./pwaSlice";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function usePwaStatus() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleOnline = () => dispatch(setOnline(true));
    const handleOffline = () => dispatch(setOnline(false));
    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      window.__zentroInstallPrompt = event as BeforeInstallPromptEvent;
      dispatch(setCanInstall(true));
    };
    const handleInstalled = () => {
      window.__zentroInstallPrompt = undefined;
      dispatch(setCanInstall(false));
      dispatch(setInstalled(true));
    };
    const handleUpdate = () => dispatch(setUpdateAvailable(true));

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    window.addEventListener("pwa:update-available", handleUpdate);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
      window.removeEventListener("pwa:update-available", handleUpdate);
    };
  }, [dispatch]);
}

export async function promptInstall() {
  const event = window.__zentroInstallPrompt;
  if (!event) return false;

  await event.prompt();
  const choice = await event.userChoice;
  window.__zentroInstallPrompt = undefined;
  return choice.outcome === "accepted";
}
