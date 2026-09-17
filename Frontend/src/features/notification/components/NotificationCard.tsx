import { motion } from "framer-motion";
import { CheckCheck, Trash2 } from "lucide-react";
import { useAppDispatch } from "@/shared/hooks";
import { Button } from "@/shared/ui/button";
import { deleteNotificationThunk, markAsReadThunk } from "../state/notificationSlice";
import type { Notification } from "../types";

interface NotificationCardProps {
  notification: Notification;
}

const timeAgo = (value: string) => {
  const delta = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 60000));
  if (delta < 60) return `${delta}m ago`;
  const hours = Math.round(delta / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
};

export const NotificationCard = ({ notification }: NotificationCardProps) => {
  const dispatch = useAppDispatch();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-4 ${notification.isRead ? "border-border bg-background" : "border-primary/30 bg-primary/5"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {!notification.isRead ? <span className="h-2.5 w-2.5 rounded-full bg-primary" /> : null}
            <p className="font-medium">{notification.title}</p>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>{timeAgo(notification.createdAt)}</span>
            {!notification.isRead ? (
              <Button variant="link" className="h-auto p-0 text-xs" onClick={() => dispatch(markAsReadThunk(notification.id))}>
                Mark read
              </Button>
            ) : null}
          </div>
        </div>
        <div className="flex gap-2">
          {!notification.isRead ? (
            <Button variant="ghost" size="icon" onClick={() => dispatch(markAsReadThunk(notification.id))}>
              <CheckCheck className="h-4 w-4" />
            </Button>
          ) : null}
          <Button variant="ghost" size="icon" onClick={() => dispatch(deleteNotificationThunk(notification.id))}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
