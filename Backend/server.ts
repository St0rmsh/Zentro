import app from "./src/app.js";
import config from "./src/config/config.js";
import ConnectDB from "./src/config/db.js";
import http from "http";
import { initailSocketIO } from "./src/Socket/socket.js"
import { registerSocketHandler } from "./src/Socket/socketHandler.js";
import redisClient from "./src/config/cache.js";
import mongoose from "mongoose";
import { initCronJobs } from "./src/utils/cron.js";
import dns from "dns"

// The previous hardcoded dns.setServers(["8.8.8.8", "8.8.4.4"]) forced every
// DNS lookup in the process through Google's public resolvers. That can
// break MongoDB Atlas SRV record resolution on some hosts, including
// Render, where the platform's own resolver is what's expected to work.
// const dns = await import("dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const server = http.createServer(app);

async function start() {
    // Fail fast and loudly if MongoDB can't connect at startup — this lets
    // Kubernetes/Render see a non-zero exit and restart the instance, instead
    // of the process limping along with a broken DB connection.
    await ConnectDB();

    const io = initailSocketIO(server);
    registerSocketHandler(io);

    initCronJobs();

    server.listen(config.PORT, () => {
        console.log(`Server is Running on Port ${config.PORT}`);
    });
}

start().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});

// Graceful shutdown: both Kubernetes and Render send SIGTERM before force-
// killing a process (e.g. on scale-down, redeploy, or free-tier spin-down).
// Without this, in-flight HTTP requests get dropped and Socket.io
// connections die uncleanly instead of closing gracefully.
const shutdown = (signal: string) => {
    console.log(`${signal} received. Shutting down gracefully...`);

    server.close(async (err) => {
        if (err) {
            console.error("Error closing HTTP server:", err);
        }

        try {
            await mongoose.connection.close();
            console.log("MongoDB connection closed");
        } catch (error) {
            console.error("Error closing MongoDB connection:", error);
        }

        try {
            redisClient.disconnect();
            console.log("Redis connection closed");
        } catch (error) {
            console.error("Error closing Redis connection:", error);
        }

        process.exit(0);
    });

    // Safety net: if something hangs (e.g. a stuck socket), force exit
    // after a grace period rather than letting Render/Kubernetes SIGKILL us
    // mid-cleanup.
    setTimeout(() => {
        console.error("Forced shutdown after timeout");
        process.exit(1);
    }, 10000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));