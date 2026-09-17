import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { useAppSelector } from "@/shared/hooks";
import { CommandPalette } from "@/shared/components/CommandPalette";
import { OfflineBanner } from "@/shared/components/OfflineBanner";
import { SEO } from "@/shared/components/SEO";
import { usePwaStatus } from "@/pwa/usePwaStatus";
import { InstallPrompt } from "@/pwa/InstallPrompt";

/**
 * Root Layout Component
 * Wraps entire application
 * Provides global providers, toaster, and common UI elements
 */
export const RootLayout = () => {
  usePwaStatus();
  const { mode } = useAppSelector((state) => state.theme);

  // For toaster theme, map system to light or dark based on actual system preference,
  // or just use system as Sonner supports "system".
  const toasterTheme = mode === "system" ? "system" : mode === "dark" ? "dark" : "light";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO />
      <OfflineBanner />
      <InstallPrompt />
      <Outlet />
      
      {/* Global Toast Notifications */}
      <Toaster
        position="bottom-right"
        theme={toasterTheme}
        richColors
        closeButton
        expand
      />

      {/* Global Portals / Modals */}
      <CommandPalette />
    </div>
  );
};
