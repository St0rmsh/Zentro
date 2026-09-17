import express from "express"
import authRouter from "./routes/auth.routes.js"
import morgan from "morgan";
import cookieParser from "cookie-parser";
import followersRouter from "./routes/Followers.routes.js";
import userProfileRouter from "./routes/userProfile.route.js";
import PostRouter from "./routes/Posts.route.js";
import likeRouter from "./routes/like.route.js";
import CommentRouter from "./routes/comment.route.js";
import bookmarkRouter from "./routes/bookmark.route.js";
import feedRouter from "./routes/feed.route.js";
import notificationRouter from "./routes/notification.routes.js";
import searchRouter from "./routes/search.route.js";
import adminRouter from "./routes/admin.routes.js";
import viewTimeRouter from "./routes/viewTime.route.js";
import messageRouter from "./routes/message.routes.js";
import readingRouter from "./routes/reading.routes.js";
import cors from "cors"
import helmet from "helmet";
import compression from "compression";
import { rateLimit } from "express-rate-limit";
import crypto from "node:crypto";
import mongoose from "mongoose";
import config from "./config/config.js";
import passport from "./config/passport.js";
import redisClient from "./config/cache.js";
const app = express()

app.set("trust proxy", config.TRUST_PROXY);

app.use(cors({
    origin: process.env.FRONTEND_ORIGINS?.split(",").map((origin) => origin.trim()) || [config.FRONTEND_ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
}))

app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());
app.use((req, res, next) => {
    const requestId = req.header("X-Request-ID") || crypto.randomUUID();
    res.setHeader("X-Request-ID", requestId);
    res.locals.requestId = requestId;
    next();
});
app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true, limit: "1mb" }))

app.use(cookieParser())
app.use(passport.initialize())

app.use(morgan(":method :url :status :response-time ms requestId=:req[x-request-id]"))

app.use("/api", rateLimit({
    windowMs: 15 * 60 * 1000,
    // Configurable so a load-testing environment can raise this without
    // weakening the real production default. Keep this LOW in production.
    limit: Number(process.env.RATE_LIMIT_MAX) || 300,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { success: false, message: "Too many requests. Please try again later." },
}));

app.get("/", (req, res) => {
    return res.status(200).json({
        message: 'Health Check route'
    })
})

app.get("/health/live", (_req, res) => {
    res.status(200).json({ success: true, status: "ok", uptime: process.uptime() });
});

app.get("/health", (_req, res) => {
    res.status(200).json({ success: true, status: "ok" });
});

app.get("/health/ready", (_req, res) => {
    const mongoReady = mongoose.connection.readyState === 1;
    // ioredis exposes a `status` string; "ready" means the connection is live and usable
    const redisReady = redisClient.status === "ready";
    const isReady = mongoReady && redisReady;

    res.status(isReady ? 200 : 503).json({
        success: isReady,
        status: isReady ? "ready" : "not_ready",
        checks: { mongo: mongoReady, redis: redisReady },
    });
});


// Auth routes
app.use("/api/auth", authRouter)



// Followers routes
app.use("/api/follow", followersRouter)


// User profile routes
app.use("/api/profile", userProfileRouter)


// Post routes
app.use("/api/post", PostRouter)


// Feed routes
app.use("/api/feed", feedRouter)


// Like routes
app.use("/api/like", likeRouter)


// Comment route
app.use("/api/comment", CommentRouter)


// Bookmark route
app.use("/api/bookmark", bookmarkRouter)

// Notification route
app.use("/api/notification", notificationRouter)

// Search route
app.use("/api/search", searchRouter)

// Admin route
app.use("/api/admin", adminRouter)

// View time route
app.use("/api/view-time", viewTimeRouter)
app.use("/api/messages", messageRouter)
app.use("/api/reading", readingRouter);


app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

app.use((error: unknown, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = typeof error === "object" && error !== null && "statusCode" in error && typeof error.statusCode === "number" ? error.statusCode : 500;
    const message = status >= 500 ? "Internal server error" : error instanceof Error ? error.message : "Request failed";
    console.error("Request failed", { requestId: res.locals.requestId, method: req.method, path: req.path, error });
    res.status(status).json({ success: false, message, requestId: res.locals.requestId });
});

export default app