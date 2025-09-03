const express = require("express");
const { protect, restrictTo } = require("./auth");
const Event = require("../models/Event");
const Ticket = require("../models/Tickets");
const User = require("../models/User");

const router = express.Router();

// All analytics routes require authentication and admin role
router.use(protect);
router.use(restrictTo("admin"));

// Get overall analytics summary
router.get("/summary", async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalTicketsSold = await Ticket.countDocuments({ status: "active" });
    const totalRevenue = await Ticket.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    const totalUsers = await User.countDocuments({ role: "user" });
    const upcomingEvents = await Event.countDocuments({
      status: { $in: ["upcoming", "active"] },
    });

    res.json({
      totalEvents,
      totalTicketsSold,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalUsers,
      upcomingEvents,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get payment analytics
router.get("/payments", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        purchaseDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    }

    const paymentData = await Ticket.aggregate([
      { $match: { ...dateFilter, status: "active" } },
      {
        $group: {
          _id: {
            year: { $year: "$purchaseDate" },
            month: { $month: "$purchaseDate" },
          },
          totalRevenue: { $sum: "$price" },
          ticketCount: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json(paymentData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get event performance analytics
router.get("/events/performance", async (req, res) => {
  try {
    const eventPerformance = await Event.aggregate([
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
          ticketsSold: { $size: "$tickets" },
          revenue: {
            $sum: "$tickets.price",
          },
          occupancyRate: {
            $multiply: [
              { $divide: [{ $size: "$tickets" }, "$totalSeats"] },
              100,
            ],
          },
        },
      },
      {
        $project: {
          title: 1,
          date: 1,
          venue: 1,
          totalSeats: 1,
          ticketsSold: 1,
          revenue: 1,
          occupancyRate: 1,
        },
      },
      { $sort: { date: -1 } },
    ]);

    res.json(eventPerformance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user engagement analytics
router.get("/users/engagement", async (req, res) => {
  try {
    const userEngagement = await User.aggregate([
      { $match: { role: "user" } },
      {
        $lookup: {
          from: "tickets",
          localField: "_id",
          foreignField: "user",
          as: "tickets",
        },
      },
      {
        $addFields: {
          ticketsPurchased: { $size: "$tickets" },
          totalSpent: {
            $sum: "$tickets.price",
          },
        },
      },
      {
        $group: {
          _id: {
            ticketsPurchased: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ["$ticketsPurchased", 0] },
                    then: "0 tickets",
                  },
                  {
                    case: { $lte: ["$ticketsPurchased", 2] },
                    then: "1-2 tickets",
                  },
                  {
                    case: { $lte: ["$ticketsPurchased", 5] },
                    then: "3-5 tickets",
                  },
                  {
                    case: { $gt: ["$ticketsPurchased", 5] },
                    then: "5+ tickets",
                  },
                ],
                default: "Unknown",
              },
            },
          },
          userCount: { $sum: 1 },
          avgSpending: { $avg: "$totalSpent" },
        },
      },
    ]);

    res.json(userEngagement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
