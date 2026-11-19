// Centralized API configuration
// When running locally, falls back to localhost:8080.
// In production on Vercel, set VITE_API_URL in Vercel project environment variables.
const envUrl = import.meta.env.VITE_API_URL;

export const API_BASE = (envUrl && envUrl.trim() !== "")
  ? envUrl.trim().replace(/\/+$/, '')
  : "http://localhost:8080/api/v1";
