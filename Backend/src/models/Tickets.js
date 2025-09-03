// models/Ticket.js
const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seatNumber: {
      type: String,
      required: true,
    },
    seatRow: {
      type: String,
      required: true,
    },
    seatColumn: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    qrCode: {
      type: String,
      required: true,
    },
    qrCodeData: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "used", "cancelled", "expired"],
      default: "active",
    },
    payment: {
      method: {
        type: String,
        enum: [
          "credit_card",
          "debit_card",
          "paypal",
          "bank_transfer",
          "qr_code",
        ],
        required: true,
      },
      transactionId: String,
      amount: Number,
      currency: {
        type: String,
        default: "LKR",
      },
      status: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending",
      },
      paidAt: Date,
    },
    checkIn: {
      checkedIn: {
        type: Boolean,
        default: false,
      },
      checkedInAt: Date,
      checkedInBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      location: {
        type: String,
      },
    },
    metadata: {
      promoCode: String,
      source: {
        type: String,
        enum: ["web", "mobile", "admin", "partner"],
        default: "web",
      },
      ipAddress: String,
      userAgent: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
ticketSchema.index({ event: 1, seatNumber: 1 });
ticketSchema.index({ user: 1, status: 1 });
ticketSchema.index({ qrCode: 1 });

// Virtual for ticket validity
ticketSchema.virtual("isValid").get(function () {
  if (this.status !== "active") return false;

  const event = this.event;
  if (!event) return false;

  const now = new Date();
  const eventDate = new Date(event.date);

  // Ticket is valid if event hasn't started yet
  return now < eventDate;
});

// Virtual for formatted purchase date
ticketSchema.virtual("formattedPurchaseDate").get(function () {
  return this.purchaseDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Virtual for ticket price with currency
ticketSchema.virtual("formattedPrice").get(function () {
  return `${this.price} ${this.payment.currency}`;
});

module.exports = mongoose.model("Ticket", ticketSchema);
