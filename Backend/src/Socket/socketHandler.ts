import { Server } from "socket.io";
import { createMessageService } from "../services/message.service.js";

export const registerSocketHandler = (io: Server) => {

  io.on("connection", (socket) => {

    const userId = socket.data.userId as string;

    if (!userId) {
      socket.disconnect();
      return;
    }

    socket.join(userId);

    socket.on("message:send", async (payload: { recipientId: string; content: string }) => {
      try {
        const message = await createMessageService(userId, payload.recipientId, payload.content);
        const populated = await message.populate("sender", "username fullname avatar");
        io.to(payload.recipientId).emit("message:new", populated);
        socket.emit("message:sent", populated);
      } catch (error) {
        socket.emit("message:error", { message: error instanceof Error ? error.message : "Unable to send message" });
      }
    });

    socket.on("typing:start", (recipientId: string) => {
      socket.to(recipientId).emit("typing:start", userId);
    });

    socket.on("typing:stop", (recipientId: string) => {
      socket.to(recipientId).emit("typing:stop", userId);
    });

    console.log(`${userId} connected`);

    socket.on("disconnect", () => {
      console.log(`${userId} disconnected`);
    });

  });

};