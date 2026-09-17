import { motion } from "framer-motion";
import { X, CheckCheck, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import type { Notification } from "../types";
import { useAppDispatch } from "@/shared/hooks";
import { deleteNotificationThunk, markAllAsReadThunk } from "../state/notificationSlice";

interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  onNotificationClick: (id: string) => void;
  onClose: () => void;
}

const timeAgo = (value: string) => {
  const delta = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 60000));
  if (delta < 60) return `${delta}m ago`;
  const hours = Math.round(delta / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
};

export const NotificationDropdown = ({ notifications, unreadCount, onNotificationClick, onClose }: NotificationDropdownProps) => {
  const dispatch = useAppDispatch();
  const groupedNotifications = notifications.reduce<Notification[][]>((groups, item) => {
    const previous = groups[groups.length - 1];
    if (previous && previous[0]?.type === item.type && item.createdAt.slice(0, 10) === previous[0].createdAt.slice(0, 10)) {
      previous.push(item);
    } else {
      groups.push([item]);
    }
    return groups;
  }, []);

  return (
    <div className="max-h-105 overflow-hidden rounded-xl">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <p className="font-semibold">Notifications</p>
          <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => dispatch(markAllAsReadThunk())}>
            <CheckCheck className="mr-1 h-4 w-4" />
            Read all
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="max-h-85 overflow-y-auto p-2">
        {notifications.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">No notifications yet.</div>
        ) : (
          groupedNotifications.map((group) => {
            const item = group[0];
            if (!item) return null;
            return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-2 rounded-lg border p-3 ${item.isRead ? "border-border/60 bg-background" : "border-primary/30 bg-primary/5"}`}
            >
              <div className="flex items-start gap-2">
                <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-primary" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{group.length > 1 ? `${item.message} and ${group.length - 1} more` : item.message}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => dispatch(deleteNotificationThunk(item.id))}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{timeAgo(item.createdAt)}</span>
                    {!item.isRead ? (
                      <Button variant="link" className="h-auto p-0 text-xs" onClick={() => onNotificationClick(item.id)}>
                        Mark read
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
