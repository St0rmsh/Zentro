/**
 * Validation Utilities
 * Common validation functions used across the application
 */

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate username
 */
export function isValidUsername(username: string): boolean {
  // Username: 3-20 characters, alphanumeric, underscore, hyphen
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isStrong: boolean;
  score: number; // 0-4
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  else feedback.push("Password must be at least 8 characters");

  if (password.length >= 12) score++;
  else if (password.length < 8) feedback.push("Use at least 8 characters");

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  else feedback.push("Use both uppercase and lowercase letters");

  if (/\d/.test(password)) score++;
  else feedback.push("Include numbers");

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  else feedback.push("Include special characters");

  return {
    isStrong: score >= 4,
    score: Math.min(score, 4),
    feedback,
  };
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate phone number
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s+()-]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

/**
 * Validate credit card number (Luhn algorithm)
 */
export function isValidCreditCard(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = parseInt(digits[i]);
    if ((digits.length - i) % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }

  return sum % 10 === 0;
}

/**
 * Validate hex color
 */
export function isValidHexColor(color: string): boolean {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexColorRegex.test(color);
}

/**
 * Validate JSON
 */
export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if string is empty or whitespace
 */
export function isEmpty(str: string): boolean {
  return !str || str.trim().length === 0;
}

/**
 * Check if string contains only letters
 */
export function isAlpha(str: string): boolean {
  return /^[a-zA-Z]+$/.test(str);
}

/**
 * Check if string contains only numbers
 */
export function isNumeric(str: string): boolean {
  return /^\d+$/.test(str);
}

/**
 * Check if string is alphanumeric
 */
export function isAlphaNumeric(str: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(str);
}

/**
 * Validate file size
 */
export function isValidFileSize(
  file: File,
  maxSizeInMB: number
): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

/**
 * Validate file type
 */
export function isValidFileType(
  file: File,
  allowedTypes: string[]
): boolean {
  return allowedTypes.some(
    (type) =>
      file.type === type ||
      type === file.type.split("/")[0] + "/*" ||
      file.name.toLowerCase().endsWith("." + type.split("/")[1])
  );
}
