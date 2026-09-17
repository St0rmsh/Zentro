/**
 * Storage Constants
 * Keys for localStorage, sessionStorage, and cookies
 */

/**
 * LocalStorage Keys
 */
export const LOCAL_STORAGE_KEYS = {
  // Theme
  THEME: "zentro:theme",
  
  // Auth
  AUTH_TOKEN: "zentro:token",
  REFRESH_TOKEN: "zentro:refreshToken",
  USER: "zentro:user",
  
  // User Preferences
  PREFERENCES: "zentro:preferences",
  LANGUAGE: "zentro:language",
  NOTIFICATIONS_ENABLED: "zentro:notificationsEnabled",
  
  // UI State
  SIDEBAR_COLLAPSED: "zentro:sidebarCollapsed",
  SIDEBAR_WIDTH: "zentro:sidebarWidth",
  MODAL_STATE: "zentro:modalState",
  
  // Drafts
  POST_DRAFT: "zentro:postDraft",
  COMMENT_DRAFT: "zentro:commentDraft",
  
  // Recent/History
  RECENT_SEARCHES: "zentro:recentSearches",
  VIEWED_PROFILES: "zentro:viewedProfiles",
  BOOKMARKS: "zentro:bookmarks",
  
  // Cache
  FOLLOWED_USERS: "zentro:followedUsers",
  BLOCKED_USERS: "zentro:blockedUsers",
  MUTED_USERS: "zentro:mutedUsers",
  
  // Development
  DEBUG_MODE: "zentro:debugMode",
} as const;

/**
 * Session Storage Keys
 */
export const SESSION_STORAGE_KEYS = {
  // Temporary Data
  SELECTED_FILTERS: "zentro:selectedFilters",
  SCROLL_POSITION: "zentro:scrollPosition",
  ACTIVE_TAB: "zentro:activeTab",
  MODAL_STACK: "zentro:modalStack",
  
  // Form State
  FORM_STATE: "zentro:formState",
  
  // Request Cache
  REQUEST_CACHE: "zentro:requestCache",
} as const;

/**
 * Cookie Keys
 */
export const COOKIE_KEYS = {
  // Auth
  SESSION_ID: "zentro:sessionId",
  ACCESS_TOKEN: "zentro:accessToken",
  
  // Tracking
  ANALYTICS_ID: "zentro:analyticsId",
  REFERRER: "zentro:referrer",
  
  // Preferences
  LANGUAGE: "zentro:language",
  TIMEZONE: "zentro:timezone",
} as const;

/**
 * Cache Duration Constants (in milliseconds)
 */
export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 60 * 60 * 1000, // 1 hour
  VERY_LONG: 24 * 60 * 60 * 1000, // 24 hours
  SESSION: 0, // Session only (cleared on close)
} as const;

/**
 * Storage Quota Limits
 */
export const STORAGE_QUOTA = {
  LOCAL_STORAGE: 5 * 1024 * 1024, // 5MB
  SESSION_STORAGE: 5 * 1024 * 1024, // 5MB
  COOKIE: 4 * 1024, // 4KB per cookie
} as const;

/**
 * Cleanup Intervals (in milliseconds)
 */
export const CLEANUP_INTERVAL = {
  AUTO_SAVE: 30 * 1000, // 30 seconds
  CACHE_CLEAR: 60 * 60 * 1000, // 1 hour
  SESSION_CHECK: 5 * 60 * 1000, // 5 minutes
} as const;
