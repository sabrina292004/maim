// models/Event.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    venue: {
      name: {
        type: String,
        required: true,
      },
      address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String,
      },
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "upcoming",
        "pending",
        "active",
        "completed",
        "cancelled",
        "closed",
      ],
      default: "upcoming",
    },
    popularity: {
      type: String,
      enum: ["Low", "Medium", "High", "Very High"],
      default: "Medium",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    expectedAttendance: {
      type: Number,
      default: 0,
    },
    qrCode: {
      type: String,
      default: "",
    },
    seatMap: {
      rows: Number,
      columns: Number,
      seats: [
        {
          row: String,
          column: Number,
          seatNumber: String,
          status: {
            type: String,
            enum: ["available", "reserved", "paid"],
            default: "available",
          },
          price: Number,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for formatted date
eventSchema.virtual("formattedDate").get(function () {
  return this.date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
});

// Virtual for formatted time
eventSchema.virtual("formattedTime").get(function () {
  return `${this.startTime} - ${this.endTime}`;
});

// Virtual for event status color
eventSchema.virtual("statusColor").get(function () {
  const colors = {
    upcoming: "blue",
    pending: "green",
    active: "green",
    completed: "gray",
    cancelled: "red",
    closed: "red",
  };
  return colors[this.status] || "gray";
});

module.exports = mongoose.model("Event", eventSchema);
