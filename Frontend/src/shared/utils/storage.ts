/**
 * Storage Helpers
 * Utility functions for localStorage with type safety
 */

export const storageKeys = {
  theme: "theme",
  user: "user",
  token: "token",
  refreshToken: "refreshToken",
  userPreferences: "userPreferences",
  notifications: "notifications",
} as const;

/**
 * Get value from localStorage
 */
export function getFromStorage<T>(key: string, defaultValue?: T): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue ?? null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue ?? null;
  }
}

/**
 * Set value in localStorage
 */
export function setToStorage<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Remove value from localStorage
 */
export function removeFromStorage(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Clear all localStorage
 */
export function clearStorage(): boolean {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error("Error clearing localStorage:", error);
    return false;
  }
}

/**
 * Check if key exists in localStorage
 */
export function hasInStorage(key: string): boolean {
  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`Error checking localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Session Storage Helper
 */
export const sessionStorageHelper = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue ?? null;
    } catch (error) {
      console.error(`Error reading from sessionStorage (${key}):`, error);
      return defaultValue ?? null;
    }
  },
  set: <T>(key: string, value: T): boolean => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to sessionStorage (${key}):`, error);
      return false;
    }
  },
  remove: (key: string): boolean => {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from sessionStorage (${key}):`, error);
      return false;
    }
  },
  clear: (): boolean => {
    try {
      sessionStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing sessionStorage:", error);
      return false;
    }
  },
};
