import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { createAdapter } from "@socket.io/redis-adapter";
import { socketAuth } from "./socketAuth.js";
import redisClient from "../config/cache.js";
import config from "../config/config.js";

let io: Server;

export const initailSocketIO = (httpServer: HttpServer) => {
    io = new Server(httpServer, {
        cors: {
            // Single source of truth — same allowlist Express CORS uses.
            // Hardcoding localhost:5173 here meant every socket handshake
            // from the deployed SPA was rejected at the CORS check, long
            // before socketAuth ever ran.
            origin: config.FRONTEND_ORIGINS,
            methods: ["GET", "POST"],
            credentials: true,
        },

        // Render terminates TLS at its proxy and forwards the upgrade, so
        // native WebSockets work — but the very first handshake after a free
        // tier spin-up can land while the instance is still booting. Allowing
        // the polling fallback lets the client connect and upgrade, instead
        // of failing outright on a refused upgrade.
        transports: ["websocket", "polling"],

        // Render's proxy will cut an idle connection at ~100s. Ping well
        // inside that window so the socket is kept alive rather than being
        // silently dropped and reconnect-looping.
        pingInterval: 25000,
        pingTimeout: 20000,

        // Browsers only attach cross-site cookies to the handshake when the
        // request is credentialed; this is the server half of that contract.
        allowEIO3: false,
    });

    /**
     * The Redis adapter needs two DEDICATED connections — a client in
     * subscribe mode cannot run normal commands. duplicate() inherits the
     * URL/TLS/auth settings from the main client, so this works unchanged
     * against both local Redis and Render Key Value.
     */
    const pubClient = redisClient.duplicate();
    const subClient = redisClient.duplicate();

    pubClient.on("error", (err) => console.error("Socket.IO Redis pub client error", err));
    subClient.on("error", (err) => console.error("Socket.IO Redis sub client error", err));

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