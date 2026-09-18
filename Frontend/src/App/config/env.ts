/**
 * Type-safe environment variables
 * All environment variables are validated and exported here
 */

// API Configuration
//
// Vite only bakes VITE_-prefixed vars into the build, and only at build
// time. The previous hardcoded "http://localhost:3000/api" meant every
// deployed build silently pointed at localhost no matter what env vars
// were set on Render — this is why the Static Site would build fine but
// every API call would fail (or hit the visitor's own machine) in the
// browser.
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://zentro-pwp3.onrender.com/api";

export const API_VERSION =
  import.meta.env.VITE_API_VERSION || "v1";

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "https://zentro-pwp3.onrender.com";

export const IMAGEKIT_URL =
  import.meta.env.VITE_IMAGEKIT_URL || "https://ik.imagekit.io/";

export const IS_PRODUCTION = import.meta.env.PROD;
export const IS_DEVELOPMENT = import.meta.env.DEV;

export const ENV = (
  import.meta.env.VITE_ENV || "production"
) as "development" | "staging" | "production";

export const FEATURES = {
  SOCKET_ENABLED: import.meta.env.VITE_ENABLE_SOCKET === "true",
  PWA_ENABLED: import.meta.env.VITE_ENABLE_PWA === "true",
  ANALYTICS_ENABLED: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
} as const;

export const envConfig = {
  api: {
    baseURL: API_BASE_URL,
    version: API_VERSION,
  },
  socket: {
    url: SOCKET_URL,
  },
  imagekit: {
    url: IMAGEKIT_URL,
  },
  app: {
    isDev: IS_DEVELOPMENT,
    isProd: IS_PRODUCTION,
    env: ENV,
  },
  features: FEATURES,
} as const;