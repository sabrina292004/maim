// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    age: {
      type: Number,
      min: 0,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    interests: [
      {
        type: String,
      },
    ],
    location: {
      city: String,
      country: String,
    },
    profileImage: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
    },
    socialMedia: {
      instagram: String,
      facebook: String,
      twitter: String,
    },
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true },
      },
      marketing: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
      },
    },
    engagement: {
      totalEvents: { type: Number, default: 0 },
      totalTickets: { type: Number, default: 0 },
      totalSpent: { type: Number, default: 0 },
      lastActive: { type: Date, default: Date.now },
    },
    verification: {
      emailVerified: { type: Boolean, default: false },
      phoneVerified: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Virtual for age group
userSchema.virtual("ageGroup").get(function () {
  if (!this.age) return "Not specified";
  if (this.age < 18) return "Under 18";
  if (this.age <= 24) return "18 - 24";
  if (this.age <= 34) return "25 - 34";
  if (this.age <= 44) return "35 - 44";
  return "45+";
});

// Virtual for engagement level
userSchema.virtual("engagementLevel").get(function () {
  if (this.engagement.totalEvents >= 10) return "Very High";
  if (this.engagement.totalEvents >= 5) return "High";
  if (this.engagement.totalEvents >= 2) return "Medium";
  return "Low";
});

module.exports = mongoose.model("User", userSchema);
