// src/api/tickets.js
import { apiCall, getAuthHeaders } from "./config.js";

export const ticketsAPI = {
  // Get user's tickets
  getUserTickets: async () => {
    return await apiCall("/tickets/my-tickets", {
      headers: getAuthHeaders(),
    });
  },

  // Book a ticket
  bookTicket: async (ticketData) => {
    return await apiCall("/tickets", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(ticketData),
    });
  },

  // Get ticket by ID
  getTicketById: async (ticketId) => {
    return await apiCall(`/tickets/${ticketId}`, {
      headers: getAuthHeaders(),
    });
  },

  // Cancel ticket
  cancelTicket: async (ticketId) => {
    return await apiCall(`/tickets/${ticketId}/cancel`, {
      method: "PUT",
      headers: getAuthHeaders(),
    });
  },

  // Get available seats for an event
  getAvailableSeats: async (eventId) => {
    return await apiCall(`/tickets/available-seats/${eventId}`, {
      headers: getAuthHeaders(),
    });
  },

  // Validate ticket (for check-in)
  validateTicket: async (ticketId, qrCode) => {
    return await apiCall(`/tickets/${ticketId}/validate`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ qrCode }),
    });
  },
};
