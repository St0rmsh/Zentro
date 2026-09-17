/**
 * Type-safe environment variables
 * All environment variables are validated and exported here
 */

// API Configuration
export const API_BASE_URL = "http://localhost:3000/api";
export const API_VERSION = "v1";

// Socket.IO Configuration
export const SOCKET_URL = "http://localhost:3000";

// ImageKit Configuration
export const IMAGEKIT_URL = import.meta.env.VITE_IMAGEKIT_URL || "https://ik.imagekit.io/";

// Environment
export const IS_PRODUCTION = import.meta.env.PROD;
export const IS_DEVELOPMENT = import.meta.env.DEV;
export const ENV = (import.meta.env.VITE_ENV || "development") as "development" | "staging" | "production";

// Feature Flags
export const FEATURES = {
  SOCKET_ENABLED: import.meta.env.VITE_ENABLE_SOCKET === "true",
  PWA_ENABLED: import.meta.env.VITE_ENABLE_PWA === "true",
  ANALYTICS_ENABLED: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
} as const;

/**
 * Environment configuration object
 * Provides centralized access to all environment variables
 */
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
