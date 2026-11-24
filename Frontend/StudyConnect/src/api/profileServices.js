import { API_BASE } from "./config";
import { makeAuthenticatedRequest } from "./apiClient";

const BASE_URL = `${API_BASE}/users/me`;

// Get user profile
export async function getUserProfile() {
  return makeAuthenticatedRequest(BASE_URL);
}

// Update user profile
export async function updateUserProfile(profileData) {
  return makeAuthenticatedRequest(`${BASE_URL}/update`, {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
}

// Change password
export async function changePassword(oldPassword, newPassword) {
  return makeAuthenticatedRequest(`${BASE_URL}/change-password`, {
    method: "PUT",
    body: JSON.stringify({ oldPassword, newPassword }),
  });
}

// Get user's study groups
export async function getUserStudyGroups() {
  return makeAuthenticatedRequest(`${BASE_URL}/groups`);
}

// Get user's interested subjects
export async function getInterestedSubjects() {
  return makeAuthenticatedRequest(`${BASE_URL}/subjects`);
}
