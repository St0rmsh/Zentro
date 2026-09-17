import dotenv from "dotenv"
dotenv.config()


if (!process.env.PORT) {
        throw new Error("PORT is undifiend")
}

if (!process.env.MONGO_URI) {
    throw new Error("Mongo Uri is undifiend")
}

if (!process.env.NODE_ENV) {
    throw new Error("NODE_ENV is undifiend")
}

if (!process.env.GOOGLE_PASS) {
     throw new Error("GOOGLE_PASS is undifiend")
}

if (!process.env.GOOGLE_USER) {
     throw new Error("GOOGLE_USER is undifiend")
}

if(!process.env.ACCESS_TOKEN){
    throw new Error("ACCESS_TOKEN is undefined")
}

if(!process.env.REFRESH_TOKEN){
    throw new Error("REFRESH_TOKEN is undefined")
}

if(!process.env.REDIS_HOST){
    throw new Error("REFRESH_TOKEN is undefined")
}

if(!process.env.REDIS_PASSWORD){
    throw new Error("REFRESH_TOKEN is undefined")
}

if(!process.env.REDIS_PORT){
    throw new Error("REDIS_PORT is undefined")
}


if(!process.env.IMAGEKIT_PUBLIC_KEY){
    throw new Error("REDIS_PORT is undefined")
}

if(!process.env.IMAGEKIT_PRIVATE_KEY){
    throw new Error("REDIS_PORT is undefined")
}

// These three are optional (the AI Poster feature degrades gracefully without them),
// so we warn loudly at startup instead of throwing — this way a missing/empty key
// is caught the moment the server boots, not hours later when a cron job fails.
if (!process.env.TAVILY_API_KEY) {
    console.warn("[config] WARNING: TAVILY_API_KEY is not set — AI Poster job will be skipped.");
}

if (!process.env.MISTRAL_API_KEY && !process.env.GEMINI_API_KEY) {
    console.warn("[config] WARNING: Neither MISTRAL_API_KEY nor GEMINI_API_KEY is set — AI Poster job will be skipped.");
} else {
    if (!process.env.MISTRAL_API_KEY) {
        console.warn("[config] WARNING: MISTRAL_API_KEY is not set — AI Poster will go straight to Gemini.");
    }
    if (!process.env.GEMINI_API_KEY) {
        console.warn("[config] WARNING: GEMINI_API_KEY is not set — AI Poster has no fallback if Mistral fails.");
    }
}


const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    NODE_ENV: process.env.NODE_ENV,
    GOOGLE_PASS: process.env.GOOGLE_PASS,
    GOOGLE_USER: process.env.GOOGLE_USER,
    ACCESS_TOKEN: process.env.ACCESS_TOKEN,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    TRUST_PROXY: process.env.TRUST_PROXY === "true",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/api/auth/google/callback",
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL || "http://localhost:3000/api/auth/github/callback",
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    TAVILY_API_KEY: process.env.TAVILY_API_KEY,
    COHERE_API_KEY: process.env.COHERE_API_KEY,
}

export default config