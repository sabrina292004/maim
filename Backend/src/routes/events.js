// routes/events.js
const express = require("express");
const { protect, restrictTo } = require("./auth");
const Event = require("../models/Event");
const Ticket = require("../models/Tickets");
const QRCode = require("qrcode");

const router = express.Router();

// Get all events with filtering and pagination
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      search,
      sortBy = "date",
      sortOrder = "asc",
    } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "venue.city": { $regex: search, $options: "i" } },
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const events = await Event.find(filter)
      .populate("organizer", "name email")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions);

    const count = await Event.countDocuments(filter);

    // Group events by status for the kanban view
    const eventsByStatus = {
      upcoming: events.filter((e) => e.status === "upcoming"),
      pending: events.filter((e) => e.status === "pending"),
      active: events.filter((e) => e.status === "active"),
      closed: events.filter((e) => e.status === "closed"),
    };

    res.json({
      events,
      eventsByStatus,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalEvents: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single event with detailed information
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "name email")
      .populate("seatMap.seats.user", "name email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Get ticket statistics
    const ticketStats = await Ticket.aggregate([
      { $match: { event: event._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          revenue: { $sum: "$price" },
        },
      },
    ]);

    // Get attendee demographics
    const attendeeDemographics = await Ticket.aggregate([
      { $match: { event: event._id, status: "active" } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $group: {
          _id: {
            ageGroup: "$userInfo.ageGroup",
            gender: "$userInfo.gender",
            location: "$userInfo.location.city",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      event,
      ticketStats,
      attendeeDemographics,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create event (Admin only)
router.post("/", protect, restrictTo("admin"), async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      startTime,
      endTime,
      venue,
      price,
      totalSeats,
      category,
      tags,
      expectedAttendance,
      popularity,
    } = req.body;

    // Generate seat map
    const rows = Math.ceil(Math.sqrt(totalSeats));
    const columns = Math.ceil(totalSeats / rows);

    const seatMap = {
      rows,
      columns,
      seats: [],
    };

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const seatNumber = `${String.fromCharCode(65 + row)}${(col + 1)
          .toString()
          .padStart(3, "0")}`;
        seatMap.seats.push({
          row: String.fromCharCode(65 + row),
          column: col + 1,
          seatNumber,
          status: "available",
          price: price,
        });
      }
    }

    // Generate QR code for the event
    const qrData = JSON.stringify({
      eventId: `EVENT_${Date.now()}`,
      type: "event",
      timestamp: Date.now(),
    });

    const qrCode = await QRCode.toDataURL(qrData);

    const event = new Event({
      title,
      description,
      date,
      startTime,
      endTime,
      venue,
      price,
      totalSeats,
      availableSeats: totalSeats,
      category,
      tags: tags || [],
      expectedAttendance: expectedAttendance || 0,
      popularity: popularity || "Medium",
      organizer: req.user.id,
      qrCode,
      seatMap,
    });

    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: error.message });
  }
});

// Update event (Admin only)
router.put("/:id", protect, restrictTo("admin"), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Prevent reducing seats below already booked seats
    if (
      req.body.totalSeats &&
      req.body.totalSeats < event.totalSeats - event.availableSeats
    ) {
      return res.status(400).json({
        message: `Cannot reduce seats below ${
          event.totalSeats - event.availableSeats
        } already booked seats`,
      });
    }

    // Update available seats if total seats changed
    if (req.body.totalSeats) {
      req.body.availableSeats =
        event.availableSeats + (req.body.totalSeats - event.totalSeats);
    }

    // Update seat map if total seats changed
    if (req.body.totalSeats && req.body.totalSeats !== event.totalSeats) {
      const rows = Math.ceil(Math.sqrt(req.body.totalSeats));
      const columns = Math.ceil(req.body.totalSeats / rows);

      const newSeatMap = {
        rows,
        columns,
        seats: [],
      };

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const seatNumber = `${String.fromCharCode(65 + row)}${(col + 1)
            .toString()
            .padStart(3, "0")}`;
          newSeatMap.seats.push({
            row: String.fromCharCode(65 + row),
            column: col + 1,
            seatNumber,
            status: "available",
            price: req.body.price || event.price,
          });
        }
      }

      req.body.seatMap = newSeatMap;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedEvent);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: error.message });
  }
});

// Delete event (Admin only)
router.delete("/:id", protect, restrictTo("admin"), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if there are tickets sold for this event
    const ticketCount = await Ticket.countDocuments({ event: req.params.id });
    if (ticketCount > 0) {
      return res.status(400).json({
        message:
          "Cannot delete event with tickets sold. Cancel the event instead.",
      });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update event status (Admin only)
router.patch("/:id/status", protect, restrictTo("admin"), async (req, res) => {
  try {
    const { status } = req.body;

    if (
      ![
        "upcoming",
        "pending",
        "active",
        "completed",
        "cancelled",
        "closed",
      ].includes(status)
    ) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get events by category
router.get("/category/:category", async (req, res) => {
  try {
    const events = await Event.find({
      category: req.params.category,
      status: { $in: ["upcoming", "active"] },
    }).populate("organizer", "name email");

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search events
router.get("/search/:query", async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 20 } = req.query;

    const events = await Event.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
        { "venue.city": { $regex: query, $options: "i" } },
      ],
      status: { $in: ["upcoming", "active"] },
    })
      .populate("organizer", "name email")
      .limit(parseInt(limit))
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
