const express = require("express");
const { protect } = require("./auth");

const router = express.Router();

// In-memory storage for support tickets (in production, use database)
let supportTickets = [];

// Create support ticket
router.post("/ticket", protect, (req, res) => {
  try {
    const {
      subject,
      message,
      priority = "medium",
      category = "general",
    } = req.body;

    if (!subject || !message) {
      return res
        .status(400)
        .json({ message: "Subject and message are required" });
    }

    const newTicket = {
      id: `SUPPORT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: req.user.id,
      userEmail: req.user.email,
      userName: req.user.name,
      subject,
      message,
      priority,
      category,
      status: "open",
      createdAt: new Date(),
      updatedAt: new Date(),
      responses: [],
    };

    supportTickets.push(newTicket);

    res.status(201).json({
      status: "success",
      message: "Support ticket created successfully",
      data: newTicket,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's support tickets
router.get("/my-tickets", protect, (req, res) => {
  try {
    const userTickets = supportTickets.filter(
      (ticket) => ticket.userId === req.user.id
    );

    res.json({
      status: "success",
      data: userTickets,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get support ticket by ID
router.get("/ticket/:id", protect, (req, res) => {
  try {
    const ticket = supportTickets.find(
      (t) => t.id === req.params.id && t.userId === req.user.id
    );

    if (!ticket) {
      return res.status(404).json({ message: "Support ticket not found" });
    }

    res.json({
      status: "success",
      data: ticket,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add response to support ticket
router.post("/ticket/:id/respond", protect, (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const ticket = supportTickets.find(
      (t) => t.id === req.params.id && t.userId === req.user.id
    );

    if (!ticket) {
      return res.status(404).json({ message: "Support ticket not found" });
    }

    const response = {
      id: `RESP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: req.user.id,
      userName: req.user.name,
      message,
      createdAt: new Date(),
    };

    ticket.responses.push(response);
    ticket.updatedAt = new Date();

    res.json({
      status: "success",
      message: "Response added successfully",
      data: response,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Close support ticket
router.put("/ticket/:id/close", protect, (req, res) => {
  try {
    const ticket = supportTickets.find(
      (t) => t.id === req.params.id && t.userId === req.user.id
    );

    if (!ticket) {
      return res.status(404).json({ message: "Support ticket not found" });
    }

    if (ticket.status === "closed") {
      return res.status(400).json({ message: "Ticket is already closed" });
    }

    ticket.status = "closed";
    ticket.updatedAt = new Date();

    res.json({
      status: "success",
      message: "Support ticket closed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all support tickets (admin only)
router.get("/all-tickets", protect, (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can view all tickets" });
    }

    res.json({
      status: "success",
      data: supportTickets,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin response to support ticket
router.post("/admin/respond/:id", protect, (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can respond to tickets" });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const ticket = supportTickets.find((t) => t.id === req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Support ticket not found" });
    }

    const response = {
      id: `ADMIN_RESP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: req.user.id,
      userName: `Admin: ${req.user.name}`,
      message,
      isAdmin: true,
      createdAt: new Date(),
    };

    ticket.responses.push(response);
    ticket.updatedAt = new Date();

    res.json({
      status: "success",
      message: "Admin response added successfully",
      data: response,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
