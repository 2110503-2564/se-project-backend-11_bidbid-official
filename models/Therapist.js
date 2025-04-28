const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UnavailableTimeSlotSchema = new mongoose.Schema({
  date: { type: String, required: true }, // e.g., "2023-10-01"
  day: { type: String, required: true }, // e.g., "Monday"
  startTime: { type: String, required: true }, // e.g., "09:00"
  endTime: { type: String, required: true }, // e.g., "17:00"
});

const TherapistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    min: 0,
    required: true,
  },
  specialities: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
  },
  workingInfo: [
    {
      massageShopID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MassageShop",
      },
      massageShop_name: String,
    },
  ],
  notAvailableDays: {
    type: [String],
    default: [],
  },
  UnavailableTimeSlot: [UnavailableTimeSlotSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comment: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Therapist", TherapistSchema);
