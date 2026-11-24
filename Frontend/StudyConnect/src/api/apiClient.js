import { authService } from "./authservice";

/**
 * Shared authenticated fetch helper.
 * - Attaches Authorization Bearer header when a token exists.
 * - Parses backend JSON or plain-text error messages cleanly.
 * - Auto-logs out on 401 Unauthorized (expired/invalid token).
 */
export const makeAuthenticatedRequest = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authService.getAuthHeader(),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    authService.logout();
    throw new Error("Your session has expired. Please sign in again.");
  }

  const text = await response.text();
  let parsed = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  }

  if (!response.ok) {
    const message =
      (parsed && typeof parsed === "object" && (parsed.message || parsed.error)) ||
      (typeof parsed === "string" && parsed.trim()) ||
      `Request failed (${response.status})`;
    throw new Error(message);
  }

  return parsed ?? {};
};
