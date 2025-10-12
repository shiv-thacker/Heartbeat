// App-wide constants
export const APP_NAME = "Heartbeat";
export const APP_VERSION = "1.0.0";

// API endpoints
export const API_BASE_URL = "https://api.example.com";
export const API_TIMEOUT = 10000;

// Storage keys
export const STORAGE_KEYS = {
  USER_TOKEN: "@user_token",
  USER_DATA: "@user_data",
  THEME_MODE: "@theme_mode",
};

// Validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
};

export default {
  APP_NAME,
  APP_VERSION,
  API_BASE_URL,
  API_TIMEOUT,
  STORAGE_KEYS,
  VALIDATION_PATTERNS,
};
