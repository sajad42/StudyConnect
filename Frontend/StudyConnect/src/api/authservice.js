// authService.js
const API_BASE = 'http://localhost:8080/api/v1';

export const authService = {
  async register(userData) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    }
    throw new Error('Registration failed');
  },

  async login(email, password) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    }
    throw new Error('Login failed');
  },

    logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Optional: redirect to login page
    window.location.href = '/login';
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : null;
  },

  getUserId() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return Number(user.id);
  },

  hasRole(role) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === role;
  },

  hasAnyRole(roles) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return roles.includes(user.role);
  }
};