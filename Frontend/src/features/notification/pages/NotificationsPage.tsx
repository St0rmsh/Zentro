import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { fetchNotificationsThunk, fetchUnreadCountThunk, markAllAsReadThunk } from "../state/notificationSlice";
import { NotificationCard } from "../components/NotificationCard";
import { Button } from "@/shared/ui/button";

export const NotificationsPage = () => {
  const dispatch = useAppDispatch();
  const { notifications, loading, hasMore, unreadCount } = useAppSelector((state) => state.notification);

  useEffect(() => {
    dispatch(fetchUnreadCountThunk());
    dispatch(fetchNotificationsThunk({ page: 1, limit: 10 }));
  }, [dispatch]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
        </div>
        <Button variant="outline" onClick={() => dispatch(markAllAsReadThunk())}>Mark all read</Button>
      </div>

      {loading && notifications.length === 0 ? (
        <div className="rounded-xl border border-border p-8 text-center text-sm text-muted-foreground">Loading notifications…</div>
      ) : notifications.length === 0 ? (
        <div className="rounded-xl border border-border p-8 text-center text-sm text-muted-foreground">You are all caught up.</div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      )}

      {hasMore ? (
        <div className="mt-4 text-center">
          <Button variant="outline" onClick={() => dispatch(fetchNotificationsThunk({ page: 2, limit: 10 }))}>
            Load more
          </Button>
        </div>
      ) : null}
    </motion.div>
  );
};
