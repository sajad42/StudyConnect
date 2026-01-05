import { authService } from "./authservice";

const BASE_URL = "https://d3agsr88vu8cwh.cloudfront.net/api/v1/groups";

// Helper function for authenticated requests
const makeAuthenticatedRequest = async (url, options = {}) => {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...authService.getAuthHeader(),
            ...options.headers
        },
        ...options
    });
    
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }
    // Check if response has content before parsing JSON
    const text = await response.text();
    return text ? JSON.parse(text) : {};
};

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
        method: 'POST',
        body: JSON.stringify(groupData)
    });
}

// Update group
export async function updateGroup(id, groupData) {
    return makeAuthenticatedRequest(`${BASE_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(groupData)
    });
}

// Delete group
export async function deleteGroup(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: authService.getAuthHeader()
    });
    
    if (!response.ok) {
        throw new Error(`Failed to delete group: ${response.status}`);
    }
}

// Get user's groups
export async function getUserGroups() {
    return makeAuthenticatedRequest(`${BASE_URL}/me`);
}

// Get subjects
export async function getSubjects() {
    return makeAuthenticatedRequest("https://d3agsr88vu8cwh.cloudfront.net/api/v1/subjects");
}

// Join a Group
export async function joinGroup(studyGroupId) {
    return makeAuthenticatedRequest(`${BASE_URL}/${studyGroupId}/join`, {
        method: 'POST'
    });
}

// Leave a Group
export async function leaveGroup(studyGroupId) {
    return makeAuthenticatedRequest(`${BASE_URL}/${studyGroupId}/leave`, {
        method: 'POST'
    });
}

