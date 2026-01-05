import { authService } from "./authservice";

const BASE_URL = "https://d3agsr88vu8cwh.cloudfront.net/api/v1/users/me";

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
export async function getUserProfile() {
    return makeAuthenticatedRequest(BASE_URL);
}

// Update user profile
export async function updateUserProfile(profileData) {
    return makeAuthenticatedRequest(`${BASE_URL}/update`, {
        method: 'PUT',
        body: JSON.stringify(profileData)
    });
}

// Get user's study groups
export async function getUserStudyGroups() {
    return makeAuthenticatedRequest(`${BASE_URL}/groups`);
}

// Get user's interested subjects
export async function getInterestedSubjects() {
    return makeAuthenticatedRequest(`${BASE_URL}/subjects`)
}