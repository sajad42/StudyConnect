import { authService } from "./authservice";

const BASE_URL = "http://localhost:8080/api/v1/users";

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

// Check if the user is an admin
export function isAnAdmin() {
    const result = authService.isAuthenticated() && authService.hasRole("ADMIN");
    return result;
};

// Get all Users
export function getUsers() {
    return makeAuthenticatedRequest(BASE_URL);
};