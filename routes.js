/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [];

/**
 * An array of routes that are used for authentication.
 * These routes will redirect logged in user to /admin/accounts.
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/forgot-password",
  "/auth/reset-password",
];

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix are used for API authentication purposes.
 * @type {string}
 */
export const apiAuthPrefix = "/api";

/**
 * The default redirect path after logged in.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
