const mongoose = require("mongoose");
const BranchOffice = require("./models/BranchOffice");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB", err));

const createBranchOffices = async () => {
  const offices = [
    {
      location: "Sucursal Centro",
      address: "Calle Falsa 123",
      phone: 123456789,
      email: "centro@sucursal.com",
      startTime: "09:00",
      endTime: "18:00",
      daysOff: [0, 6],
      simultAppointment: 2,
      price: 100.5,
    },
    {
      location: "Sucursal Norte",
      address: "Av. Siempreviva 742",
      phone: 987654321,
      email: "norte@sucursal.com",
      startTime: "10:00",
      endTime: "19:00",
      daysOff: [0],
      simultAppointment: 3,
      price: 150.75,
    },
  ];

  try {
    await BranchOffice.insertMany(offices);
    console.log("Sucursales creadas exitosamente");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error al crear sucursales", error);
    mongoose.disconnect();
  }
};

createBranchOffices();
