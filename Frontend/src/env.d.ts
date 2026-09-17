/**
 * Type definitions for environment variables
 * Provides type-safe access to import.meta.env
 */

interface ImportMetaEnv {
  // API Configuration
  readonly VITE_API_URL: string;
  readonly VITE_API_VERSION: string;

  // Socket.IO Configuration
  readonly VITE_SOCKET_URL: string;

  // ImageKit Configuration
  readonly VITE_IMAGEKIT_URL: string;

  // Environment
  readonly VITE_ENV: "development" | "staging" | "production";

  // Feature Flags
  readonly VITE_ENABLE_SOCKET: string;
  readonly VITE_ENABLE_PWA: string;
  readonly VITE_ENABLE_ANALYTICS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  __zentroInstallPrompt?: Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  };
}
