// src/api/auth.js
import { apiCall, getAuthHeaders } from "./config.js";

export const authAPI = {
  login: async (email, password) => {
    const response = await apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response;
  },

  register: async (userData) => {
    const response = await apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (response.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response;
  },

  verifyToken: async (token) => {
    try {
      const response = await apiCall("/auth/me", {
        headers: getAuthHeaders(),
      });
      return response.data.user;
    } catch (error) {
      // Remove invalid token
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};
