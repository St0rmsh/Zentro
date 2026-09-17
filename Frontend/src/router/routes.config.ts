/**
 * Central route configuration
 * Maintains single source of truth for all application routes
 */

export const ROUTES = {
  // Auth Routes
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password/:token",
  VERIFY_OTP: "/auth/verify-otp",
  CHANGE_PASSWORD: "/auth/change-password",

  // Main Routes
  HOME: "/",
  FEED: "/feed",
  EXPLORE: "/explore",
  SEARCH: "/search",
  DISCOVER: "/discover",
  OWN_PROFILE: "/app/profile",
  PROFILE: "/app/profile/:username",
  SETTINGS: "/settings",

  // Feature Routes
  POSTS: "/posts",
  POST_DETAIL: "/posts/:id",
  BOOKMARKS: "/bookmarks",
  FOLLOWERS: "/app/profile/:userId/followers",
  FOLLOWING: "/app/profile/:userId/following",
  NOTIFICATIONS: "/notifications",
  MESSAGES: "/messages",

  // Settings Routes
  ACCOUNT_SETTINGS: "/settings/account",
  PROFILE_SETTINGS: "/settings/profile",
  SECURITY_SETTINGS: "/settings/security",
  APPEARANCE_SETTINGS: "/settings/appearance",
  PRIVACY_SETTINGS: "/settings/privacy",
  PREFERENCES_SETTINGS: "/settings/preferences",
  ABOUT_SETTINGS: "/settings/about",
  HELP_SETTINGS: "/settings/help",

  // Admin Routes
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USERS: "/admin/users",
  ADMIN_POSTS: "/admin/posts",
  ADMIN_COMMENTS: "/admin/comments",
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_TAGS: "/admin/tags",
  ADMIN_ANALYTICS: "/admin/analytics",
  ADMIN_SETTINGS: "/admin/settings",
  ADMIN_LOGS: "/admin/logs",

  // System Routes
  NOT_FOUND: "*",
  UNAUTHORIZED: "/401",
  FORBIDDEN: "/403",
  ERROR: "/error",
  OFFLINE: "/offline",
} as const;

export type RouteKey = keyof typeof ROUTES;

/**
 * Route access levels
 */
export const RouteAccessLevel = {
  PUBLIC: "public",
  GUEST: "guest", // Only for non-authenticated users
  PROTECTED: "protected", // Only for authenticated users
  ADMIN: "admin", // Only for admin users
} as const;

export type RouteAccessLevel = typeof RouteAccessLevel[keyof typeof RouteAccessLevel];

/**
 * Route metadata for advanced routing logic
 */
export const ROUTE_METADATA: Record<
  string,
  {
    title: string;
    accessLevel: RouteAccessLevel;
    requiresAuth?: boolean;
    requiresAdmin?: boolean;
    description?: string;
  }
> = {
  [ROUTES.LOGIN]: {
    title: "Login",
    accessLevel: RouteAccessLevel.GUEST,
    requiresAuth: false,
  },
  [ROUTES.REGISTER]: {
    title: "Register",
    accessLevel: RouteAccessLevel.GUEST,
    requiresAuth: false,
  },
  [ROUTES.FORGOT_PASSWORD]: {
    title: "Forgot Password",
    accessLevel: RouteAccessLevel.GUEST,
    requiresAuth: false,
  },
  [ROUTES.RESET_PASSWORD]: {
    title: "Reset Password",
    accessLevel: RouteAccessLevel.GUEST,
    requiresAuth: false,
  },
  [ROUTES.VERIFY_OTP]: {
    title: "Verify OTP",
    accessLevel: RouteAccessLevel.GUEST,
    requiresAuth: false,
  },
  [ROUTES.HOME]: {
    title: "Home",
    accessLevel: RouteAccessLevel.PROTECTED,
    requiresAuth: true,
  },
  [ROUTES.FEED]: {
    title: "Feed",
    accessLevel: RouteAccessLevel.PROTECTED,
    requiresAuth: true,
  },
  [ROUTES.EXPLORE]: {
    title: "Explore",
    accessLevel: RouteAccessLevel.PROTECTED,
    requiresAuth: true,
  },
  [ROUTES.SEARCH]: {
    title: "Search",
    accessLevel: RouteAccessLevel.PROTECTED,
    requiresAuth: true,
  },
  [ROUTES.DISCOVER]: {
    title: "Discover",
    accessLevel: RouteAccessLevel.PROTECTED,
    requiresAuth: true,
  },
  [ROUTES.PROFILE]: {
    title: "Profile",
    accessLevel: RouteAccessLevel.PROTECTED,
    requiresAuth: true,
  },
  [ROUTES.SETTINGS]: {
    title: "Settings",
    accessLevel: RouteAccessLevel.PROTECTED,
    requiresAuth: true,
  },
  [ROUTES.ADMIN_DASHBOARD]: {
    title: "Admin Dashboard",
    accessLevel: RouteAccessLevel.ADMIN,
    requiresAuth: true,
    requiresAdmin: true,
  },
};
