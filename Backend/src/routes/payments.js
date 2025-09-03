const express = require("express");
const { protect } = require("./auth");
const Ticket = require("../models/Tickets");
const Event = require("../models/Event");

const router = express.Router();

// Process payment for ticket
router.post("/process", protect, async (req, res) => {
  try {
    const { eventId, seatNumber, paymentMethod } = req.body;

    // Validate event exists and has available seats
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.availableSeats < 1) {
      return res.status(400).json({ message: "No available seats" });
    }

    // Check if seat is already taken
    const existingTicket = await Ticket.findOne({
      event: eventId,
      seatNumber,
    });

    if (existingTicket) {
      return res.status(400).json({ message: "Seat already taken" });
    }

    // Simulate payment processing (in production, integrate with Stripe/PayPal)
    const paymentResult = await simulatePayment({
      amount: event.price,
      currency: "USD",
      paymentMethod,
      userId: req.user.id,
    });

    if (!paymentResult.success) {
      return res.status(400).json({ message: "Payment failed" });
    }

    // Create ticket after successful payment
    const ticket = new Ticket({
      event: eventId,
      user: req.user.id,
      seatNumber,
      price: event.price,
      qrCode: `TICKET_${Date.now()}_${req.user.id}_${eventId}`,
      paymentId: paymentResult.paymentId,
    });

    await ticket.save();

    // Update event available seats
    event.availableSeats -= 1;
    await event.save();

    const populatedTicket = await Ticket.findById(ticket._id).populate(
      "event",
      "title date venue"
    );

    res.status(201).json({
      message: "Payment successful and ticket created",
      ticket: populatedTicket,
      payment: paymentResult,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get payment history for user
router.get("/history", protect, async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id })
      .populate("event", "title date venue")
      .sort({ createdAt: -1 });

    const paymentHistory = tickets.map((ticket) => ({
      id: ticket._id,
      event: ticket.event.title,
      date: ticket.event.date,
      amount: ticket.price,
      status: ticket.status,
      paymentDate: ticket.createdAt,
    }));

    res.json(paymentHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get payment details by ticket ID
router.get("/ticket/:ticketId", protect, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId)
      .populate("event", "title date venue")
      .populate("user", "name email");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Ensure user can only access their own tickets (unless admin)
    if (
      ticket.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({
      ticket: {
        id: ticket._id,
        event: ticket.event.title,
        date: ticket.event.date,
        venue: ticket.event.venue,
        seatNumber: ticket.seatNumber,
        price: ticket.price,
        status: ticket.status,
        paymentDate: ticket.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Simulate payment processing (replace with real payment gateway)
async function simulatePayment(paymentData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate 95% success rate
      const isSuccess = Math.random() > 0.05;

      if (isSuccess) {
        resolve({
          success: true,
          paymentId: `PAY_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: "completed",
        });
      } else {
        resolve({
          success: false,
          error: "Payment declined by bank",
        });
      }
    }, 1000); // Simulate 1 second processing time
  });
}

module.exports = router;
