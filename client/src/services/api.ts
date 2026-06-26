import axios from "axios";

// ─── Axios Instance ──────────────────────────────────────
// In development, Vite proxy forwards /api to the backend.
// In production, set VITE_API_URL to the backend URL.

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor: Attach JWT ─────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("shikshasetu_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Handle 401 ────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("shikshasetu_token");
      localStorage.removeItem("shikshasetu_user");
      // Redirect to login if token is invalid/expired
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
