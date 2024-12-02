const { Router } = require("express");
const router = Router();
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const BranchOffice = require("../models/BranchOffice");
const parseId = require("../utils/functions");
const NewAppointment = require("../utils/NewAppoinment");
const Cancelar = require("../utils/Cancelar");
require("dotenv").config();
const transport = require("../config/emailer");
const {
  htmlTemplateReserved,
  htmlTemplateCanceled,
  htmlTemplateReminder,
} = require("../config/html");

/* Rutas
(1) Usuario - Crear turno.
(2) Usuario - Cancelar un turno.
(3) Usuario - Mostrar todos sus turnos.
(4) Operador - Confirmar un turno.
(5) Operador - Muestra turnos para un día, horario y sucursal.
(6) Administrador - Cambiar el estado a asistido.
(7) Administrador - Cambiar el estado a ausente.
*/

// (1) Crear un nuevo turno
router.post("/:id", async (req, res) => {
  const userId = req.params.id;
  const { date, month, year, day, time, branchId, appointId } = req.body;

  const newAppointment = new Appointment({
    date,
    month,
    year,
    day,
    time,
    branchOffice: branchId,
    user: userId,
  });

  try {
    const branchOffice = await BranchOffice.findById(branchId);

    const existingAppointments = await Appointment.find({
      date,
      month,
      year,
      time,
      branchOffice: branchId,
    });

    const appointmentSameUser = await Appointment.find({
      date,
      month,
      year,
      available: false,
      user: userId,
    });

    if (existingAppointments.length === 0) {
      if (appointmentSameUser.length > 0) {
        return res
          .status(400)
          .json({ error: "Ya tiene un turno activo para este día." });
      } else {
        const savedAppointment = await newAppointment.save();
        NewAppointment(branchId, userId, savedAppointment._id);

        if (appointId) {
          Cancelar(appointId);
        }

        return res.status(200).json(savedAppointment);
      }
    } else {
      return res.status(400).json({
        error: "Turno no disponible para la sucursal y horario seleccionado.",
      });
    }
  } catch (error) {
    console.error("Error al crear el turno:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
});

// (2) Cancelar un turno
router.put("/:userId/myAppointment/remove", async (req, res) => {
  const { userId } = req.params;
  const { id } = req.body;

  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: parseId(id) },
      { state: "cancelado", available: true }
    );

    const branchOffice = await BranchOffice.findById(appointment.branchOffice);
    const userData = await User.findById(userId);

    const info = {
      from: "info@miturno.com",
      to: userData.email,
      subject: `Turno cancelado en ${branchOffice.location}`,
      text: "Su turno ha sido cancelado.",
      html: htmlTemplateCanceled,
    };

    transport.sendMail(info);
    res.status(200).json({ message: "Turno cancelado exitosamente." });
  } catch (err) {
    console.error("Error al cancelar el turno:", err);
    res.status(500).json({ error: "Error al cancelar el turno." });
  }
});

// (3) Mostrar turnos de un usuario
router.get("/:id/showAppointments", async (req, res) => {
  const { id } = req.params;

  try {
    const appointments = await Appointment.find({ user: id }).populate(
      "branchOffice",
      "location address"
    );
    res.status(200).json({ data: appointments });
  } catch (err) {
    console.error("Error al obtener los turnos:", err);
    res.status(500).json({ error: "Error al obtener los turnos." });
  }
});

// (4) Confirmar un turno
router.put("/:userId/myAppointment/confirmed", async (req, res) => {
  const { userId } = req.params;
  const { id } = req.body;

  try {
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Turno no encontrado." });
    }

    if (appointment.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "No tiene permiso para confirmar este turno." });
    }

    if (appointment.state !== "reservado") {
      return res
        .status(400)
        .json({ message: "El turno no está en estado reservado." });
    }

    appointment.state = "confirmado";
    await appointment.save();

    res.status(200).json({ message: "Turno confirmado exitosamente." });
  } catch (err) {
    console.error("Error al confirmar el turno:", err);
    res.status(500).json({ error: "Error al confirmar el turno." });
  }
});

// (6) Cambiar estado a asistido
router.put("/confirmAttendance", async (req, res) => {
  const { appointmentId } = req.body;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Turno no encontrado." });
    }

    if (appointment.state !== "confirmado") {
      return res
        .status(400)
        .json({ message: "El turno debe estar confirmado para ser asistido." });
    }

    appointment.state = "asistido";
    await appointment.save();

    res.status(200).json({ message: "Turno marcado como asistido." });
  } catch (err) {
    console.error("Error al marcar como asistido:", err);
    res.status(500).json({ error: "Error al marcar como asistido." });
  }
});

// (7) Cambiar estado a ausente
router.put("/markAbsent", async (req, res) => {
  const { appointmentId } = req.body;

  try {
    const appointment = await Appointment.findByIdAndUpdate(appointmentId, {
      state: "ausente",
    });

    if (!appointment) {
      return res.status(404).json({ message: "Turno no encontrado." });
    }

    res.status(200).json({ message: "Turno marcado como ausente." });
  } catch (err) {
    console.error("Error al marcar como ausente:", err);
    res.status(500).json({ error: "Error al marcar como ausente." });
  }
});

// (8) Obtener todos los turnos con información completa
router.get("/all", async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("user", "fname lname dni email")
      .populate("branchOffice", "location address");

    if (!appointments.length) {
      return res.status(404).json({ message: "No hay turnos registrados." });
    }

    res.status(200).json({ data: appointments });
  } catch (err) {
    console.error("Error al obtener los turnos:", err);
    res.status(500).json({ error: "Error al obtener los turnos." });
  }
});

module.exports = router;
