import { useSessionMonitor } from "../hooks/useSessionMonitor";
import { Button } from "@/shared/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export const SessionExpiryModal = () => {
  const { showWarning, continueSession } = useSessionMonitor();

  return (
    <AnimatePresence>
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card text-card-foreground p-6 rounded-lg shadow-lg w-full max-w-sm"
          >
            <h3 className="text-lg font-semibold mb-2">Session Expiring Soon</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Your session will expire soon due to inactivity. Would you like to continue?
            </p>
            <div className="flex justify-end gap-3">
              <Button onClick={continueSession}>
                Continue Session
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
