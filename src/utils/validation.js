import { VALIDATION_PATTERNS } from "./constants";

/**
 * Validate email address
 */
export const validateEmail = (email) => {
  return VALIDATION_PATTERNS.EMAIL.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  return VALIDATION_PATTERNS.PASSWORD.test(password);
};

/**
 * Validate phone number
 */
export const validatePhone = (phone) => {
  return VALIDATION_PATTERNS.PHONE.test(phone);
};

/**
 * Validate required field
 */
export const validateRequired = (value) => {
  return value !== undefined && value !== null && value !== "";
};

/**
 * Get error message for validation
 */
export const getValidationError = (field, value) => {
  if (!validateRequired(value)) {
    return `${field} is required`;
  }

  if (field === "Email" && !validateEmail(value)) {
    return "Please enter a valid email address";
  }

  if (field === "Password" && !validatePassword(value)) {
    return "Password must be at least 8 characters with uppercase, lowercase, and number";
  }

  if (field === "Phone" && !validatePhone(value)) {
    return "Please enter a valid phone number";
  }

  return null;
};

export default {
  validateEmail,
  validatePassword,
  validatePhone,
  validateRequired,
  getValidationError,
};
