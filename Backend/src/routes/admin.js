// routes/admin.js
const express = require("express");
const mongoose = require("mongoose");
const { protect, restrictTo } = require("./auth");
const Event = require("../models/Event");
const Ticket = require("../models/Tickets");
const User = require("../models/User");

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(restrictTo("admin"));

// Get comprehensive dashboard statistics
router.get("/dashboard-stats", async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalTicketsSold = await Ticket.countDocuments({ status: "active" });
    const totalRevenue = await Ticket.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    const upcomingEvents = await Event.countDocuments({
      status: { $in: ["upcoming", "pending"] },
    });

    const activeEvents = await Event.countDocuments({ status: "active" });
    const closedEvents = await Event.countDocuments({ status: "closed" });

    // Get recent events for the dashboard
    const recentEvents = await Event.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title date status venue");

    // Get upcoming events
    const upcomingEventList = await Event.find({
      status: { $in: ["upcoming", "pending"] },
    })
      .sort({ date: 1 })
      .limit(5)
      .select("title date venue status");

    // Get latest notifications (mock data for now)
    const notifications = [
      {
        id: 1,
        message: "Paycheck released for artists @Wayo Event",
        type: "payment",
        timestamp: new Date(),
      },
      {
        id: 2,
        message: "Total revenue has been transferred to bank",
        type: "finance",
        timestamp: new Date(Date.now() - 86400000),
      },
      {
        id: 3,
        message: "@Alan Walker Event in 3 days",
        type: "reminder",
        timestamp: new Date(Date.now() - 172800000),
      },
    ];

    res.json({
      totalEvents,
      totalTicketsSold,
      totalRevenue: totalRevenue[0]?.total || 0,
      upcomingEvents,
      activeEvents,
      closedEvents,
      recentEvents,
      upcomingEventList,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get net sales analytics with time-based filtering
router.get("/net-sales", async (req, res) => {
  try {
    const { period = "weekly" } = req.query;

    let dateFilter = {};
    const now = new Date();

    switch (period) {
      case "daily":
        dateFilter = {
          $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
        };
        break;
      case "weekly":
        dateFilter = {
          $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30),
        };
        break;
      case "monthly":
        dateFilter = {
          $gte: new Date(now.getFullYear(), now.getMonth() - 6, 1),
        };
        break;
      default:
        dateFilter = {
          $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30),
        };
    }

    const salesData = await Ticket.aggregate([
      {
        $match: {
          status: "active",
          purchaseDate: dateFilter,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$purchaseDate" },
            month: { $month: "$purchaseDate" },
            day: { $dayOfMonth: "$purchaseDate" },
          },
          totalRevenue: { $sum: "$price" },
          ticketCount: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    // Format data for charts
    const formattedData = salesData.map((item) => ({
      date: `${item._id.month}/${item._id.day}`,
      revenue: item.totalRevenue,
      tickets: item.ticketCount,
    }));

    res.json({
      period,
      data: formattedData,
      totalRevenue: salesData.reduce((sum, item) => sum + item.totalRevenue, 0),
      totalTickets: salesData.reduce((sum, item) => sum + item.ticketCount, 0),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get customer engagement analytics
router.get("/customer-engagement", async (req, res) => {
  try {
    const engagementData = await Event.aggregate([
      {
        $lookup: {
          from: "tickets",
          localField: "_id",
          foreignField: "event",
          as: "tickets",
        },
      },
      {
        $addFields: {
          attendeeCount: { $size: "$tickets" },
          revenue: {
            $sum: "$tickets.price",
          },
        },
      },
      {
        $project: {
          title: 1,
          attendeeCount: 1,
          revenue: 1,
          status: 1,
        },
      },
      { $sort: { attendeeCount: -1 } },
      { $limit: 5 },
    ]);

    res.json(engagementData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendee demographics with detailed breakdown
router.get("/attendee-demographics", async (req, res) => {
  try {
    // Age groups with detailed breakdown
    const ageGroups = await User.aggregate([
      { $match: { age: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lte: ["$age", 17] }, then: "Under 18" },
                { case: { $lte: ["$age", 24] }, then: "18-24" },
                { case: { $lte: ["$age", 34] }, then: "25-34" },
                { case: { $lte: ["$age", 44] }, then: "35-44" },
                { case: { $gt: ["$age", 44] }, then: "45+" },
              ],
              default: "Not specified",
            },
          },
          count: { $sum: 1 },
          percentage: { $avg: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Gender distribution
    const genderDistribution = await User.aggregate([
      { $match: { gender: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: "$gender",
          count: { $sum: 1 },
          percentage: { $avg: 1 },
        },
      },
    ]);

    // Location distribution with top cities
    const locationDistribution = await User.aggregate([
      { $match: { "location.city": { $exists: true, $ne: null } } },
      { $group: { _id: "$location.city", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Interests breakdown
    const interestsBreakdown = await User.aggregate([
      { $match: { interests: { $exists: true, $ne: null } } },
      { $unwind: "$interests" },
      { $group: { _id: "$interests", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Engagement levels
    const engagementLevels = await User.aggregate([
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                {
                  case: { $gte: ["$engagement.totalEvents", 10] },
                  then: "Very High",
                },
                {
                  case: { $gte: ["$engagement.totalEvents", 5] },
                  then: "High",
                },
                {
                  case: { $gte: ["$engagement.totalEvents", 2] },
                  then: "Medium",
                },
                { case: { $gte: ["$engagement.totalEvents", 1] }, then: "Low" },
              ],
              default: "No Events",
            },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      ageGroups,
      genderDistribution,
      locationDistribution,
      interestsBreakdown,
      engagementLevels,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get event-specific analytics
router.get("/event-analytics/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const ticketsSold = await Ticket.countDocuments({
      event: eventId,
      status: "active",
    });

    const revenue = await Ticket.aggregate([
      { $match: { event: mongoose.Types.ObjectId(eventId), status: "active" } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    const attendanceRate = (ticketsSold / event.totalSeats) * 100;

    // Get attendee demographics for this specific event
    const eventAttendees = await Ticket.aggregate([
      { $match: { event: mongoose.Types.ObjectId(eventId), status: "active" } },
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

    // Get social media engagement (mock data for now)
    const socialMediaEngagement = {
      instagram: Math.floor(Math.random() * 10000) + 1000,
      facebook: Math.floor(Math.random() * 8000) + 800,
      twitter: Math.floor(Math.random() * 5000) + 500,
      qrScans: ticketsSold,
    };

    res.json({
      event: event.title,
      ticketsSold,
      revenue: revenue[0]?.total || 0,
      attendanceRate: Math.round(attendanceRate * 100) / 100,
      availableSeats: event.availableSeats,
      attendeeDemographics: eventAttendees,
      socialMediaEngagement,
      totalEngagement: Object.values(socialMediaEngagement).reduce(
        (a, b) => a + b,
        0
      ),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Export event data in CSV format
router.get("/export-events", async (req, res) => {
  try {
    const events = await Event.find().populate("organizer", "name email");

    // Convert to CSV format
    const csvData = events.map((event) => ({
      Title: event.title,
      Date: event.date.toISOString().split("T")[0],
      StartTime: event.startTime,
      EndTime: event.endTime,
      Venue: event.venue.name,
      City: event.venue.city,
      Price: event.price,
      TotalSeats: event.totalSeats,
      AvailableSeats: event.availableSeats,
      Status: event.status,
      Popularity: event.popularity,
      Category: event.category,
      Organizer: event.organizer.name,
      ExpectedAttendance: event.expectedAttendance,
    }));

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=events.csv");

    // Create CSV string
    const csvString = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    res.send(csvString);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users with filtering and pagination
router.get("/users", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      ageGroup,
      location,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filter = {};

    if (role) filter.role = role;
    if (ageGroup) filter.ageGroup = ageGroup;
    if (location) filter["location.city"] = { $regex: location, $options: "i" };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const users = await User.find(filter)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions);

    const count = await User.countDocuments(filter);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalUsers: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user role
router.put("/users/:id/role", async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
