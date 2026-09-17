import { useEffect, useState } from "react";
import { WifiOff, CloudOff } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { offlineService } from "../services/offline.service";

export const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [queueLength, setQueueLength] = useState(offlineService.getQueueLength());

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      offlineService.processQueue();
    };
    const handleOffline = () => setIsOffline(true);

    const handleQueueUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      setQueueLength(customEvent.detail);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("offline_queue_updated", handleQueueUpdate);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("offline_queue_updated", handleQueueUpdate);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-[100] flex justify-center p-2 pointer-events-none"
        >
          <div className="bg-zinc-800 text-zinc-100 px-4 py-2 rounded-full shadow-lg border border-zinc-700 flex items-center gap-3 pointer-events-auto">
            <WifiOff className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium">You are offline. Some features may be unavailable.</span>
            {queueLength > 0 && (
              <div className="flex items-center gap-1 ml-2 pl-2 border-l border-zinc-600 text-amber-400">
                <CloudOff className="w-3 h-3" />
                <span className="text-xs">{queueLength} unsynced</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
