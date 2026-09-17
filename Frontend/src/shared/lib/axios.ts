import axios, { InternalAxiosRequestConfig } from "axios";

import { API_BASE_URL } from "@/App/config/env.js";
import { ROUTES } from "../constants/routes";
import { socketService } from "./socket.js";

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
    _refreshRetry?: boolean;
  }
}

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000, // 30 second global timeout
});


/**
 * Request interceptor
 * Adds unique request ID to all requests
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add unique request ID for tracking
    config.headers['X-Request-ID'] = crypto.randomUUID();
    return config;
  },
  (error) => Promise.reject(error)
);

// Token refresh state management
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

let logoutCallback: (() => void) | null = null;

/**
 * Register a callback to be called when logout is needed
 * Called when refresh token is invalid or expired
 */
export const registerLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

/**
 * Process queued requests after token refresh
 * Either retries them or rejects them
 */
const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

/**
 * Response interceptor
 * Handles 401 errors by automatically refreshing the access token
 * Implements exponential backoff for token refresh queue
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Only handle 401 errors that haven't been retried yet and are not auth endpoints
    const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || 
                          originalRequest.url?.includes('/auth/logout') || 
                          originalRequest.url?.includes('/auth/refresh-access-token');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      // If refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint
        await axios.post(
          `${API_BASE_URL}/auth/refresh-access-token`,
          {},
          { 
            timeout: 10000, // 10 second timeout for refresh
            withCredentials: true // ensure httpOnly cookies are sent
          } 
        );

        // Update socket token and reconnect
        socketService.reconnect();

        // Broadcast token refresh to other tabs
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem('auth_token_refreshed', JSON.stringify({
            timestamp: Date.now()
          }));
        }

        // Process queued requests
        processQueue(null);
        
        // Retry original request with new cookies
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Token refresh failed - likely refresh token expired
        processQueue(refreshError);
        socketService.disconnect();

        // Notify other tabs about logout via localStorage
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem('auth_logout', JSON.stringify({
            timestamp: Date.now(),
            reason: 'token_refresh_failed'
          }));
        }

        // Call registered logout callback if available
        if (logoutCallback) {
          logoutCallback();
        } else {
          // Fallback: redirect to login
          if (typeof window !== "undefined") {
            window.location.href = ROUTES.LOGIN;
          }
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
