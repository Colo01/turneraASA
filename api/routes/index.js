const express = require("express");
const router = express.Router();

const usersRoutes = require("./users");
const deliveryPointRoutes = require("./DeliveryPoint");
const availableAppointmentRoutes = require("./availableAppointment");
const adminAppointmentRoutes = require("./adminAppointments");

router.use("/users", usersRoutes);
router.use("/deliveryPoints", deliveryPointRoutes);
router.use("/availableAppointments", availableAppointmentRoutes);
router.use("/admin/appointments", adminAppointmentRoutes);

module.exports = router;
