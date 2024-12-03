// api/models/DeliveryPoint.js

const mongoose = require("mongoose");

const DeliveryPointSchema = new mongoose.Schema({
  location: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  daysOff: { type: [Number], default: [] },
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }], // Relación con Appointment
});

module.exports = mongoose.model("DeliveryPoint", DeliveryPointSchema);
