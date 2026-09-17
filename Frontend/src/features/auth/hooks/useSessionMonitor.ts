import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./useAuth";

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes of inactivity
const WARNING_BEFORE_MS = 5 * 60 * 1000; // Show warning 5 mins before timeout

export const useSessionMonitor = () => {
  const { isAuthenticated, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const resetActivity = useCallback(() => {
    setLastActivity(Date.now());
    setShowWarning(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetActivity));

    const intervalId = setInterval(() => {
      const inactiveTime = Date.now() - lastActivity;

      if (inactiveTime >= SESSION_TIMEOUT_MS) {
        logout();
      } else if (inactiveTime >= SESSION_TIMEOUT_MS - WARNING_BEFORE_MS) {
        setShowWarning(true);
      }
    }, 60000); // Check every minute

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetActivity));
      clearInterval(intervalId);
    };
  }, [isAuthenticated, lastActivity, logout, resetActivity]);

  return {
    showWarning,
    continueSession: resetActivity,
  };
};
