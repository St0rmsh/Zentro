import { socketService } from "@/shared/lib/socket";
import type { AppDispatch } from "@/store";
import { addNotification, setUnreadCount } from "../state/notificationSlice";
import { normalizeNotification } from "./notification.service";

export const registerNotificationSocketListeners = (dispatch: AppDispatch) => {
  const handler = (payload: any) => {
    if (payload?.notification) {
      dispatch(addNotification(normalizeNotification(payload.notification)));
    }

    if (typeof payload?.unreadCount === "number") {
      dispatch(setUnreadCount(payload.unreadCount));
    }
  };

  socketService.on("notification", handler);

  return () => {
    socketService.off("notification", handler);
  };
};
