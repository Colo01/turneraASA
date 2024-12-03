const mongoose = require("mongoose");
const DeliveryPoint = require("./models/DeliveryPoint"); // Asegúrate de tener un modelo actualizado
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB", err));

const createDeliveryPoints = async () => {
  const points = [
    {
      location: "Punto Centro",
      address: "Calle Verdadera 123",
      phone: 123456789,
      email: "centro@puntoentrega.com",
      startTime: "09:00",
      endTime: "18:00",
      daysOff: [0, 6], // Domingos y sábados
    },
    {
      location: "Punto Norte",
      address: "Av. Real 742",
      phone: 987654321,
      email: "norte@puntoentrega.com",
      startTime: "10:00",
      endTime: "19:00",
      daysOff: [0], // Domingos
    },
  ];

  try {
    await DeliveryPoint.insertMany(points); // Cambiado a DeliveryPoint
    console.log("Puntos de entrega creados exitosamente");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error al crear puntos de entrega", error);
    mongoose.disconnect();
  }
};

createDeliveryPoints();
