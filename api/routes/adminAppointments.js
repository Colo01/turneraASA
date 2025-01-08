// api/routes/adminAppointments.js

const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

// Nueva ruta: Listar turnos para administrador y acciones de asistencia/ausencia
router.get("/", async (req, res) => {
    try {
      // Obtener todos los turnos reservados junto con información del usuario y punto de entrega
      const appointments = await Appointment.find({ state: "reservado" })
        .populate("user", "fname lname dni") // Información del usuario
        .populate("deliveryPoint", "location address"); // Información del punto de entrega
  
      if (appointments.length === 0) {
        return res.status(404).json({ message: "No hay turnos reservados." });
      }
  
      res.status(200).json({ data: appointments });
    } catch (error) {
      console.error("Error al listar turnos reservados:", error.message);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  });
  
  // Ruta para marcar un turno como asistido o ausente
  router.put("/:id/mark", async (req, res) => {
    const { id } = req.params;
    const { action } = req.body; // "asistido" o "ausente"
  
    if (!["asistido", "ausente"].includes(action)) {
      return res.status(400).json({ error: "Acción no válida." });
    }
  
    try {
      const appointment = await Appointment.findById(id);
      if (!appointment) {
        return res.status(404).json({ message: "Turno no encontrado." });
      }
  
      // Actualizar el estado del turno
      appointment.state = action;
      await appointment.save();
  
      res.status(200).json({ message: `Turno marcado como ${action}.` });
    } catch (error) {
      console.error("Error al actualizar el estado del turno:", error.message);
      res.status(500).json({ error: "Error interno del servidor." });
    }
});

module.exports = router;