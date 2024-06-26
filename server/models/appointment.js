const mongoose = require("mongoose");
const { Schema } = mongoose;

const appointmentSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    // 10-12, 12-14, 15-17, 17-19, 21-23
    required: true,
  },
  patientId: {
    type: Schema.Types.ObjectId,
    ref: "patient",
    required: true,
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: "doctor",
    required: true,
  },
  reason: { type: String, required: true },

  status: {
    type: String,
    enum: ["completed", "approved", "rejected", "pending", "canceled"],
    default: "pending",
  },
});

module.exports = mongoose.model("appointment", appointmentSchema);
