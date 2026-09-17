export const PROFILE_MESSAGES = {
  PROFILE_UPDATED: "Profile updated successfully",
  PROFILE_UPDATE_ERROR: "Failed to update profile",
  PASSWORD_CHANGED: "Password changed successfully",
  PASSWORD_CHANGE_ERROR: "Failed to change password",
  VERIFICATION_PENDING: "Email verification pending",
} as const;

export const PROFILE_TABS = {
  ACCOUNT: "account",
  APPEARANCE: "appearance",
  SECURITY: "security",
} as const;

export const APPEARANCE_THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;
