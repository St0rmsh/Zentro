import { useEffect, useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { Button } from "@/shared/ui/button";
import { fetchNotificationsThunk, fetchUnreadCountThunk, markAsReadThunk } from "../state/notificationSlice";
import { registerNotificationSocketListeners } from "../services/socket.service";
import { NotificationDropdown } from "./NotificationDropdown";

export const NotificationBell = () => {
  const dispatch = useAppDispatch();
  const { unreadCount, notifications } = useAppSelector((state) => state.notification);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUnreadCountThunk());
    dispatch(fetchNotificationsThunk({ page: 1, limit: 5 }));

    const cleanup = registerNotificationSocketListeners(dispatch);
    return cleanup;
  }, [dispatch]);

  const recentNotifications = useMemo(() => notifications.slice(0, 5), [notifications]);

  const handleOpen = async () => {
    setOpen((value) => !value);
    if (notifications.length === 0) {
      dispatch(fetchNotificationsThunk({ page: 1, limit: 5 }));
    }
  };

  const handleNotificationClick = (notificationId: string) => {
    dispatch(markAsReadThunk(notificationId));
  };

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full" onClick={handleOpen}>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 ? (
          <motion.span
            key={unreadCount}
            initial={{ scale: 0.8, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute right-1.5 top-1.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        ) : null}
      </Button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-background shadow-xl"
          >
            <NotificationDropdown
              notifications={recentNotifications}
              unreadCount={unreadCount}
              onNotificationClick={handleNotificationClick}
              onClose={() => setOpen(false)}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
