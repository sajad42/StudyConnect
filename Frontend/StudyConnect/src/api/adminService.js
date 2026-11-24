import { authService } from "./authservice";
import { API_BASE } from "./config";
import { makeAuthenticatedRequest } from "./apiClient";

const BASE_URL = `${API_BASE}/users`;

// Check if the user is an admin
export function isAnAdmin() {
  return authService.isAuthenticated() && authService.hasRole("ADMIN");
}

// Get all Users
export function getUsers() {
  return makeAuthenticatedRequest(BASE_URL);
}
