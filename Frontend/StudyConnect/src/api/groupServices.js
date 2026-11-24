import { API_BASE } from "./config";
import { makeAuthenticatedRequest } from "./apiClient";

const BASE_URL = `${API_BASE}/groups`;

// Get all groups
export async function getAllGroups() {
  return makeAuthenticatedRequest(BASE_URL);
}

// Get group by ID
export async function getGroupById(id) {
  return makeAuthenticatedRequest(`${BASE_URL}/${id}`);
}

// Create new group
export async function createGroup(groupData) {
  return makeAuthenticatedRequest(BASE_URL, {
    method: "POST",
    body: JSON.stringify(groupData),
  });
}

// Update group
export async function updateGroup(id, groupData) {
  return makeAuthenticatedRequest(`${BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(groupData),
  });
}

// Delete group
export async function deleteGroup(id) {
  return makeAuthenticatedRequest(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
}

// Get user's groups
export async function getUserGroups() {
  return makeAuthenticatedRequest(`${BASE_URL}/me`);
}

// Get subjects
export async function getSubjects() {
  return makeAuthenticatedRequest(`${API_BASE}/subjects`);
}

// Join a Group
export async function joinGroup(studyGroupId) {
  return makeAuthenticatedRequest(`${BASE_URL}/${studyGroupId}/join`, {
    method: "POST",
  });
}

// Leave a Group
export async function leaveGroup(studyGroupId) {
  return makeAuthenticatedRequest(`${BASE_URL}/${studyGroupId}/leave`, {
    method: "POST",
  });
}
