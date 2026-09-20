import dotenv from "dotenv"
dotenv.config()

/**
 * Hard requirements: the server genuinely cannot run without these.
 * Everything else degrades gracefully with a loud warning instead of
 * crashing the container on boot.
 */
if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is undefined")
}

if (!process.env.ACCESS_TOKEN) {
    throw new Error("ACCESS_TOKEN is undefined")
}

if (!process.env.REFRESH_TOKEN) {
    throw new Error("REFRESH_TOKEN is undefined")
}

// Render injects PORT at runtime. Locally we fall back to 3000.
const PORT = Number(process.env.PORT) || 3000

const NODE_ENV = process.env.NODE_ENV || "development"
const IS_PRODUCTION = NODE_ENV === "production"

/**
 * Redis / Render Key Value.
 * Render gives you ONE connection string (internal or external), not
 * separate host/port/password fields. Prefer REDIS_URL when present and
 * fall back to the discrete vars for local docker-compose.
 */
const REDIS_URL = process.env.REDIS_URL || ""

if (!REDIS_URL && !process.env.REDIS_HOST) {
    console.warn(
        "[config] WARNING: no REDIS_URL or REDIS_HOST set — falling back to localhost:6379."
    )
}

/**
 * Allowed browser origins.
 *
 * Production:
 * https://zentro-pwp3.onrender.com
 *
 * Local development:
 * http://localhost:5173
 */
const rawOrigins =
    process.env.FRONTEND_ORIGINS ||
    process.env.FRONTEND_ORIGIN ||
    (IS_PRODUCTION
        ? "https://zentro-pwp3.onrender.com"
        : "http://localhost:5173")

const FRONTEND_ORIGINS = rawOrigins
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean)

// Primary origin — used for OAuth redirects back to the SPA.
const FRONTEND_ORIGIN =
    FRONTEND_ORIGINS[0] ||
    (IS_PRODUCTION
        ? "https://zentro-pwp3.onrender.com"
        : "http://localhost:5173")

/**
 * Cookie policy.
 *
 * Since the frontend and backend are now served from the SAME
 * Render origin, SameSite=Lax is sufficient for normal authentication.
 *
 * If you later separate frontend and backend onto different domains,
 * use SameSite=None + Secure=true.
 */
const COOKIE_SAMESITE = (
    process.env.COOKIE_SAMESITE ||
    "lax"
) as "none" | "lax" | "strict"

const COOKIE_SECURE = process.env.COOKIE_SECURE
    ? process.env.COOKIE_SECURE === "true"
    : IS_PRODUCTION

if (COOKIE_SAMESITE === "none" && !COOKIE_SECURE) {
    console.warn(
        "[config] WARNING: COOKIE_SAMESITE=none requires COOKIE_SECURE=true. Browsers will reject these cookies."
    )
}

/**
 * Optional integrations — warn, don't throw.
 */
if (!process.env.GOOGLE_USER || !process.env.GOOGLE_PASS) {
    console.warn(
        "[config] WARNING: GOOGLE_USER / GOOGLE_PASS not set — OTP and transactional email will fail."
    )
}

if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY) {
    console.warn(
        "[config] WARNING: IMAGEKIT keys not set — image upload will fail."
    )
}

if (!process.env.TAVILY_API_KEY) {
    console.warn(
        "[config] WARNING: TAVILY_API_KEY is not set — AI Poster job will be skipped."
    )
}

if (!process.env.MISTRAL_API_KEY && !process.env.GEMINI_API_KEY) {
    console.warn(
        "[config] WARNING: Neither MISTRAL_API_KEY nor GEMINI_API_KEY is set — AI Poster job will be skipped."
    )
} else {
    if (!process.env.MISTRAL_API_KEY) {
        console.warn(
            "[config] WARNING: MISTRAL_API_KEY is not set — AI Poster will go straight to Gemini."
        )
    }

    if (!process.env.GEMINI_API_KEY) {
        console.warn(
            "[config] WARNING: GEMINI_API_KEY is not set — AI Poster has no fallback if Mistral fails."
        )
    }
}

const config = {
    PORT,
    NODE_ENV,
    IS_PRODUCTION,

    MONGO_URI: process.env.MONGO_URI,

    ACCESS_TOKEN: process.env.ACCESS_TOKEN,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN,

    REDIS_URL,
    REDIS_HOST: process.env.REDIS_HOST || "localhost",
    REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || undefined,

    GOOGLE_USER: process.env.GOOGLE_USER,
    GOOGLE_PASS: process.env.GOOGLE_PASS,

    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,

    FRONTEND_ORIGIN,
    FRONTEND_ORIGINS,

    COOKIE_SAMESITE,
    COOKIE_SECURE,

    // Render always sits behind a proxy.
    TRUST_PROXY: process.env.TRUST_PROXY
        ? process.env.TRUST_PROXY === "true"
        : IS_PRODUCTION,

    // Skip the hardcoded Google DNS override unless explicitly opted in.
    CUSTOM_DNS: process.env.CUSTOM_DNS === "true",

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    GOOGLE_CALLBACK_URL:
        process.env.GOOGLE_CALLBACK_URL ||
        (IS_PRODUCTION
            ? "https://zentro-pwp3.onrender.com/api/auth/google/callback"
            : "http://localhost:3000/api/auth/google/callback"),

    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

    GITHUB_CALLBACK_URL:
        process.env.GITHUB_CALLBACK_URL ||
        (IS_PRODUCTION
            ? "https://zentro-pwp3.onrender.com/api/auth/github/callback"
            : "http://localhost:3000/api/auth/github/callback"),

    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    TAVILY_API_KEY: process.env.TAVILY_API_KEY,
    COHERE_API_KEY: process.env.COHERE_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
}

export default config