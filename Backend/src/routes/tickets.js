// routes/tickets.js
const express = require("express");
const mongoose = require("mongoose");
const { protect } = require("./auth");
const QRCode = require("qrcode");
const Ticket = require("../models/Tickets");
const Event = require("../models/Event");

const router = express.Router();

// Get user's tickets with detailed information
router.get("/my-tickets", protect, async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id })
      .populate("event", "title date startTime endTime venue image status")
      .sort({ purchaseDate: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Book ticket with seat selection
router.post("/", protect, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      eventId,
      seatNumber,
      seatRow,
      seatColumn,
      paymentMethod = "qr_code",
    } = req.body;

    const event = await Event.findById(eventId).session(session);
    if (!event) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.availableSeats < 1) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "No available seats" });
    }

    // Check if seat is already taken
    const existingTicket = await Ticket.findOne({
      event: eventId,
      seatNumber,
    }).session(session);

    if (existingTicket) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Seat already taken" });
    }

    // Validate seat coordinates
    if (seatRow && seatColumn) {
      const seatExists = event.seatMap.seats.find(
        (seat) => seat.row === seatRow && seat.column === seatColumn
      );

      if (!seatExists) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: "Invalid seat coordinates" });
      }

      if (seatExists.status !== "available") {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: "Seat is not available" });
      }
    }

    // Generate QR code data
    const qrData = JSON.stringify({
      ticketId: `TICKET_${Date.now()}_${req.user.id}_${eventId}`,
      eventId,
      userId: req.user.id,
      seatNumber,
      timestamp: Date.now(),
      type: "ticket",
    });

    const qrCode = await QRCode.toDataURL(qrData);

    // Create ticket
    const ticket = new Ticket({
      event: eventId,
      user: req.user.id,
      seatNumber,
      seatRow: seatRow || "A",
      seatColumn: seatColumn || 1,
      price: event.price,
      originalPrice: event.price,
      qrCode,
      qrCodeData: qrData,
      payment: {
        method: paymentMethod,
        amount: event.price,
        currency: "LKR",
        status: "completed",
        paidAt: new Date(),
      },
    });

    // Update event available seats
    event.availableSeats -= 1;

    // Update seat status in event
    if (event.seatMap && event.seatMap.seats) {
      const seatIndex = event.seatMap.seats.findIndex(
        (seat) => seat.seatNumber === seatNumber
      );

      if (seatIndex !== -1) {
        event.seatMap.seats[seatIndex].status = "paid";
      }
    }

    await ticket.save({ session });
    await event.save({ session });

    await session.commitTransaction();
    session.endSession();

    const populatedTicket = await Ticket.findById(ticket._id).populate(
      "event",
      "title date startTime endTime venue image"
    );

    res.status(201).json({
      message: "Ticket booked successfully",
      ticket: populatedTicket,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: error.message });
  }
});

// Cancel ticket with seat reallocation
router.put("/:id/cancel", protect, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const ticket = await Ticket.findById(req.params.id).session(session);

    if (!ticket) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (ticket.user.toString() !== req.user.id) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this ticket" });
    }

    if (ticket.status === "cancelled") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Ticket already cancelled" });
    }

    // Update event available seats
    const event = await Event.findById(ticket.event).session(session);
    event.availableSeats += 1;

    // Update seat status in event
    if (event.seatMap && event.seatMap.seats) {
      const seatIndex = event.seatMap.seats.findIndex(
        (seat) => seat.seatNumber === ticket.seatNumber
      );

      if (seatIndex !== -1) {
        event.seatMap.seats[seatIndex].status = "available";
      }
    }

    // Update ticket status
    ticket.status = "cancelled";

    await event.save({ session });
    await ticket.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Ticket cancelled successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
});

// Get available seats for an event with visual representation
router.get("/available-seats/:eventId", protect, async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Get all booked seats for this event
    const bookedSeats = await Ticket.find({
      event: eventId,
      status: { $ne: "cancelled" },
    }).select("seatNumber seatRow seatColumn");

    const bookedSeatNumbers = bookedSeats.map((ticket) => ticket.seatNumber);

    // Generate seat map with availability status
    const seatMap = {
      rows: event.seatMap?.rows || Math.ceil(Math.sqrt(event.totalSeats)),
      columns:
        event.seatMap?.columns ||
        Math.ceil(
          event.totalSeats /
            (event.seatMap?.rows || Math.ceil(Math.sqrt(event.totalSeats)))
        ),
      seats: [],
    };

    for (let row = 0; row < seatMap.rows; row++) {
      for (let col = 0; col < seatMap.columns; col++) {
        const seatNumber = `${String.fromCharCode(65 + row)}${(col + 1)
          .toString()
          .padStart(3, "0")}`;
        const isBooked = bookedSeatNumbers.includes(seatNumber);

        seatMap.seats.push({
          row: String.fromCharCode(65 + row),
          column: col + 1,
          seatNumber,
          status: isBooked ? "booked" : "available",
          price: event.price,
        });
      }
    }

    const availableSeats = seatMap.seats.filter(
      (seat) => seat.status === "available"
    );

    res.json({
      eventId,
      totalSeats: event.totalSeats,
      availableSeats: availableSeats.length,
      bookedSeats: bookedSeats.length,
      seatMap,
      availableSeatNumbers: availableSeats.map((seat) => seat.seatNumber),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Validate ticket for check-in
router.post("/:id/validate", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { qrCode, location } = req.body;

    const ticket = await Ticket.findById(id)
      .populate("event", "title date startTime endTime venue")
      .populate("user", "name email");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Verify QR code
    if (ticket.qrCodeData !== qrCode) {
      return res.status(400).json({ message: "Invalid QR code" });
    }

    if (ticket.status !== "active") {
      return res.status(400).json({ message: "Ticket is not active" });
    }

    // Check if event has started
    const now = new Date();
    const eventDate = new Date(ticket.event.date);

    if (now < eventDate) {
      return res.status(400).json({ message: "Event has not started yet" });
    }

    // Mark ticket as used
    ticket.status = "used";
    ticket.checkIn = {
      checkedIn: true,
      checkedInAt: new Date(),
      checkedInBy: req.user.id,
      location: location || "Main Entrance",
    };

    await ticket.save();

    res.json({
      message: "Ticket validated successfully",
      ticket: {
        id: ticket._id,
        event: ticket.event.title,
        date: ticket.event.date,
        time: `${ticket.event.startTime} - ${ticket.event.endTime}`,
        venue: ticket.event.venue.name,
        seatNumber: ticket.seatNumber,
        attendee: ticket.user.name,
        checkInTime: ticket.checkIn.checkedInAt,
        location: ticket.checkIn.location,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get ticket details by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("event", "title date startTime endTime venue image")
      .populate("user", "name email");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Ensure user can only access their own tickets (unless admin)
    if (
      ticket.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this ticket" });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get ticket statistics for an event (admin only)
router.get("/event/:eventId/stats", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { eventId } = req.params;

    const stats = await Ticket.aggregate([
      { $match: { event: mongoose.Types.ObjectId(eventId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          revenue: { $sum: "$price" },
        },
      },
    ]);

    const totalTickets = stats.reduce((sum, stat) => sum + stat.count, 0);
    const totalRevenue = stats.reduce((sum, stat) => sum + stat.revenue, 0);

    res.json({
      eventId,
      totalTickets,
      totalRevenue,
      breakdown: stats,
      summary: {
        active: stats.find((s) => s._id === "active")?.count || 0,
        used: stats.find((s) => s._id === "used")?.count || 0,
        cancelled: stats.find((s) => s._id === "cancelled")?.count || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
