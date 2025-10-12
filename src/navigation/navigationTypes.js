/**
 * Navigation Types and Route Names
 * Define all navigation routes and their parameters here
 */

// Auth Stack Routes
export const AuthRoutes = {
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
};

// Main Stack Routes
export const MainRoutes = {
  HOME: 'Home',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
};

// All Routes combined
export const Routes = {
  ...AuthRoutes,
  ...MainRoutes,
};

/**
 * Type definitions for navigation params
 * Use these with TypeScript for type-safe navigation
 */

// Example:
// export type AuthStackParamList = {
//   Login: undefined;
//   Register: undefined;
//   ForgotPassword: undefined;
// };

// export type MainStackParamList = {
//   Home: undefined;
//   Profile: { userId?: string };
//   Settings: undefined;
// };
