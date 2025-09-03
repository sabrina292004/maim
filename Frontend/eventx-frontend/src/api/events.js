// src/api/events.js
import { apiCall, getAuthHeaders } from "./config.js";

export const eventsAPI = {
  // Get all events
  getAllEvents: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/events?${queryParams}` : "/events";
    return await apiCall(endpoint);
  },

  // Get single event by ID
  getEventById: async (eventId) => {
    return await apiCall(`/events/${eventId}`);
  },

  // Create new event (admin only)
  createEvent: async (eventData) => {
    return await apiCall("/events", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData),
    });
  },

  // Update event (admin only)
  updateEvent: async (eventId, eventData) => {
    return await apiCall(`/events/${eventId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData),
    });
  },

  // Delete event (admin only)
  deleteEvent: async (eventId) => {
    return await apiCall(`/events/${eventId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
  },

  // Get events by category
  getEventsByCategory: async (category) => {
    return await apiCall(`/events?category=${category}`);
  },

  // Search events
  searchEvents: async (searchTerm) => {
    return await apiCall(`/events?search=${searchTerm}`);
  },
};
