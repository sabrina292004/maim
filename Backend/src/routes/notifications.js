const express = require("express");
const { protect } = require("./auth");
const User = require("../models/User");

const router = express.Router();

// In-memory storage for notifications (in production, use database)
let notifications = [];

// Get user notifications
router.get("/", protect, (req, res) => {
  try {
    const userNotifications = notifications.filter(
      (notification) => notification.userId === req.user.id
    );

    res.json({
      status: "success",
      data: userNotifications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark notification as read
router.put("/:id/read", protect, (req, res) => {
  try {
    const notification = notifications.find(
      (n) => n.id === req.params.id && n.userId === req.user.id
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.read = true;

    res.json({
      status: "success",
      message: "Notification marked as read",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark all notifications as read
router.put("/read-all", protect, (req, res) => {
  try {
    notifications.forEach((notification) => {
      if (notification.userId === req.user.id) {
        notification.read = true;
      }
    });

    res.json({
      status: "success",
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete notification
router.delete("/:id", protect, (req, res) => {
  try {
    const notificationIndex = notifications.findIndex(
      (n) => n.id === req.params.id && n.userId === req.user.id
    );

    if (notificationIndex === -1) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notifications.splice(notificationIndex, 1);

    res.json({
      status: "success",
      message: "Notification deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send notification (admin only)
router.post("/send", protect, (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can send notifications" });
    }

    const { userId, title, message, type = "info" } = req.body;

    if (!userId || !title || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newNotification = {
      id: `NOTIF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date(),
    };

    notifications.push(newNotification);

    res.status(201).json({
      status: "success",
      message: "Notification sent successfully",
      data: newNotification,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send bulk notifications (admin only)
router.post("/send-bulk", protect, (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can send bulk notifications" });
    }

    const { userIds, title, message, type = "info" } = req.body;

    if (!userIds || !Array.isArray(userIds) || !title || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newNotifications = userIds.map((userId) => ({
      id: `NOTIF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date(),
    }));

    notifications.push(...newNotifications);

    res.status(201).json({
      status: "success",
      message: `${newNotifications.length} notifications sent successfully`,
      count: newNotifications.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
