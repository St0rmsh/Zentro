import { Redis, type RedisOptions } from 'ioredis'
import config from "./config.js";

/**
 * Connection options shared by the main client and by the pub/sub clients
 * that the Socket.IO Redis adapter duplicates off it.
 *
 * - maxRetriesPerRequest: null keeps commands queued across a reconnect
 *   instead of failing them outright. On Render's free tier the Key Value
 *   instance and the web service can briefly drop connection; without this
 *   in-flight commands throw "max retries per request" errors.
 * - enableReadyCheck stays on so redisClient.status === "ready" (used by
 *   /health/ready) actually means usable, not just socket-connected.
 */
const baseOptions: RedisOptions = {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    connectTimeout: 10000,
    retryStrategy(times: number) {
        // Back off up to 5s, then keep retrying forever rather than giving up.
        return Math.min(times * 200, 5000);
    },
};

/**
 * Render Key Value hands you a single connection string, not discrete
 * host/port/password fields:
 *   internal -> redis://red-xxxxx:6379        (same region, no TLS, no auth)
 *   external -> rediss://red-xxxxx:pass@host  (TLS, requires auth)
 *
 * ioredis parses both forms natively, and switches on TLS by itself for
 * the rediss:// scheme. Prefer the URL when it's set; fall back to the
 * discrete vars so local docker-compose keeps working unchanged.
 */
const createClient = (): Redis => {
    if (config.REDIS_URL) {
        return new Redis(config.REDIS_URL, baseOptions);
    }

    return new Redis({
        ...baseOptions,
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
        // undefined (not "") when unset — an empty-string password makes
        // ioredis send an AUTH command that Valkey rejects.
        password: config.REDIS_PASSWORD,
    });
};

const redisClient = createClient();

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('ready', () => {
    console.log('Redis client ready');
});

redisClient.on('error', (err) => {
    console.error("Error connecting to redis", err);
});

redisClient.on('end', () => {
    console.warn('Redis connection closed');
});

export default redisClient