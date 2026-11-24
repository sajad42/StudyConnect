// authservice.js
import { API_BASE } from "./config";

const extractErrorMessage = async (response, fallback) => {
  try {
    const text = await response.text();
    if (!text) return fallback;
    try {
      const parsed = JSON.parse(text);
      return parsed.message || parsed.error || fallback;
    } catch {
      return text;
    }
  } catch {
    return fallback;
  }
};

export const authService = {
  async register(userData) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    }

    const message = await extractErrorMessage(
      response,
      response.status === 409
        ? "An account with this email already exists."
        : "Registration failed. Please check your details and try again."
    );
    throw new Error(message);
  },

  async login(email, password) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    }

    const message = await extractErrorMessage(
      response,
      "Invalid email or password. Please try again."
    );
    throw new Error(message);
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  isAuthenticated() {
    return Boolean(localStorage.getItem("token"));
  },

  getAuthHeader() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  getUser() {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  },

  setUser(user) {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  },

  getUserId() {
    const user = this.getUser();
    return Number(user.id);
  },

  hasRole(role) {
    const user = this.getUser();
    return user.role === role;
  },

  hasAnyRole(roles) {
    const user = this.getUser();
    return roles.includes(user.role);
  },
};
