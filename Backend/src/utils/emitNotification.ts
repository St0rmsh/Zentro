import { getIO } from "../Socket/socket.js";

import { getSocketId } from "../Socket/userSocketMap.js";

export const emitNotification = (
  recipientId: string,
  notification: any
) => {

  const socketId = getSocketId(recipientId);

  if (!socketId) return;

  getIO()
    .to(socketId)
    .emit("notification", notification);

};