// src/api/admin.js
import { apiCall, getAuthHeaders } from "./config.js";

export const adminAPI = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    return await apiCall("/admin/dashboard-stats", {
      headers: getAuthHeaders(),
    });
  },

  // Get attendee demographics
  getAttendeeDemographics: async () => {
    return await apiCall("/admin/attendee-demographics", {
      headers: getAuthHeaders(),
    });
  },

  // Get event analytics
  getEventAnalytics: async (eventId) => {
    return await apiCall(`/admin/event-analytics/${eventId}`, {
      headers: getAuthHeaders(),
    });
  },

  // Export events data
  exportEvents: async () => {
    return await apiCall("/admin/export-events", {
      headers: getAuthHeaders(),
    });
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    return await apiCall("/users", {
      headers: getAuthHeaders(),
    });
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    return await apiCall(`/users/${userId}/role`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    });
  },

  // Get payment analytics
  getPaymentAnalytics: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams
      ? `/analytics/payments?${queryParams}`
      : "/analytics/payments";
    return await apiCall(endpoint, {
      headers: getAuthHeaders(),
    });
  },
};
