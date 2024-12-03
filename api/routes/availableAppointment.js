// api/routes/availableAppointments.js

const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

// Ejemplo de una ruta
router.get("/", async (req, res) => {
  const { deliveryPointId } = req.query;

  try {
    const appointments = await Appointment.find({ deliveryPoint: deliveryPointId, state: "disponible" });
    res.status(200).json({ data: appointments });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

module.exports = router;
