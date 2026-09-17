import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { socketAuth } from "./socketAuth.js";
import redisClient from "../config/cache.js";

let io: Server;

export const initailSocketIO = (httpServer: any) => {
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    const pubClient = redisClient.duplicate();
    const subClient = redisClient.duplicate();
    io.adapter(createAdapter(pubClient, subClient));

    io.use(socketAuth);

    return io;
};


export const getIO = () => {

    if (!io) {
        throw new Error("Socket.IO not initialized");
    }
    return io;
};