const mongoose = require("mongoose");
const Appointment = require("./models/Appointment");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB", err));

const createAppointments = async () => {
  const appointments = [
    {
      date: "01",
      month: "00",
      year: "2024",
      day: "1",
      time: "09:15",
      available: true,
      state: "reservado",
    },
    {
      date: "02",
      month: "00",
      year: "2024",
      day: "2",
      time: "10:30",
      available: true,
      state: "confirmado",
    },
  ];

  try {
    await Appointment.insertMany(appointments);
    console.log("Turnos creados exitosamente");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error al crear turnos", error);
    mongoose.disconnect();
  }
};

createAppointments();
