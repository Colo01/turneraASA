// api/models/Appointment.js

const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  availableSlots: { type: Number, default: 1 },
  deliveryPoint: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryPoint" }, // Relación con DeliveryPoint
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Relación con User
  state: { type: String, default: "disponible" }, // Ejemplo: disponible, reservado, confirmado
});

module.exports = mongoose.model("Appointment", AppointmentSchema);

