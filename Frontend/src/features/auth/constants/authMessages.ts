export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: "Welcome back!",
  REGISTER_SUCCESS: "Account created successfully. Please verify your email.",
  LOGOUT_SUCCESS: "Logged out successfully.",
  UPDATE_PROFILE_SUCCESS: "Profile updated successfully.",
  SEND_OTP_SUCCESS: "OTP sent to your email.",
  VERIFY_OTP_SUCCESS: "OTP verified successfully.",
  CHANGE_PASSWORD_SUCCESS: "Password changed successfully.",
  RESET_PASSWORD_SUCCESS: "Password reset successfully.",
  FORGOT_PASSWORD_SUCCESS: "Password reset link sent to your email.",
  SESSION_EXPIRED: "Your session has expired. Please login again.",
  GENERIC_ERROR: "Something went wrong. Please try again.",
} as const;
