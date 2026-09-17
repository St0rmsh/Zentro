/**
 * Validation Constants
 * Regular expressions and validation rules
 */

export const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  username: /^[a-zA-Z0-9_-]{3,20}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  phone: /^[\d\s+()-]{10,}$/,
  creditCard: /^(\d{4}[\s-]?){3}\d{4}$/,
  hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  zipCode: /^\d{5}(-\d{4})?$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  ipv4: /^(\d{1,3}\.){3}\d{1,3}$/,
  ipv6: /^([\da-fA-F]{0,4}:){2,7}[\da-fA-F]{0,4}$/,
} as const;

export const VALIDATION_RULES = {
  email: {
    minLength: 5,
    maxLength: 255,
    pattern: REGEX.email,
    message: "Please enter a valid email address",
  },
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: REGEX.username,
    message: "Username must be 3-20 characters and can contain letters, numbers, hyphens, and underscores",
  },
  password: {
    minLength: 8,
    maxLength: 128,
    pattern: REGEX.password,
    message: "Password must contain uppercase, lowercase, numbers, and special characters",
  },
  passwordConfirm: {
    message: "Passwords do not match",
  },
  fullName: {
    minLength: 2,
    maxLength: 100,
    message: "Full name must be between 2 and 100 characters",
  },
  phone: {
    minLength: 10,
    maxLength: 20,
    pattern: REGEX.phone,
    message: "Please enter a valid phone number",
  },
  url: {
    pattern: REGEX.url,
    message: "Please enter a valid URL",
  },
  zipCode: {
    pattern: REGEX.zipCode,
    message: "Please enter a valid ZIP code",
  },
  slug: {
    pattern: REGEX.slug,
    message: "Slug must contain only lowercase letters, numbers, and hyphens",
  },
} as const;

/**
 * File Validation
 */
export const FILE_VALIDATION = {
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  ALLOWED_VIDEO_TYPES: ["video/mp4", "video/webm", "video/ogg"],
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
  
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_AVATAR_SIZE: 2 * 1024 * 1024, // 2MB
  
  IMAGE_WIDTH_LIMITS: {
    min: 100,
    max: 4000,
  },
  IMAGE_HEIGHT_LIMITS: {
    min: 100,
    max: 4000,
  },
} as const;

/**
 * Password Strength Levels
 */
export const PASSWORD_STRENGTH = {
  WEAK: {
    score: 1,
    label: "Weak",
    color: "error",
  },
  FAIR: {
    score: 2,
    label: "Fair",
    color: "warning",
  },
  GOOD: {
    score: 3,
    label: "Good",
    color: "info",
  },
  STRONG: {
    score: 4,
    label: "Strong",
    color: "success",
  },
} as const;

/**
 * Content Validation Limits
 */
export const CONTENT_LIMITS = {
  POST_TITLE_MIN: 5,
  POST_TITLE_MAX: 200,
  POST_CONTENT_MIN: 1,
  POST_CONTENT_MAX: 5000,
  
  COMMENT_MIN: 1,
  COMMENT_MAX: 1000,
  
  BIO_MAX: 500,
  FULLNAME_MAX: 100,
  USERNAME_MAX: 30,
  
  HASHTAG_MAX: 30,
  MENTIONS_MAX: 50,
} as const;

/**
 * Rate Limiting
 */
export const RATE_LIMITS = {
  POST_CREATE: 1000, // 1 second between posts
  COMMENT_CREATE: 500, // 0.5 second between comments
  LIKE_CREATE: 100, // 0.1 second between likes
  API_CALL: 100, // 0.1 second min between API calls
} as const;
