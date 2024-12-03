// api/routes/index.js

const express = require("express");
const router = express.Router();

const usersRoutes = require("./users");
const deliveryPointRoutes = require("./DeliveryPoint");
const availableAppointmentRoutes = require("./availableAppointment");

router.use("/users", usersRoutes);
router.use("/deliveryPoints", deliveryPointRoutes);
router.use("/availableAppointments", availableAppointmentRoutes);

module.exports = router;
