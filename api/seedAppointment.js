const Appointment = require("./models/Appointment");
const DeliveryPoint = require("./models/DeliveryPoint");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB", err));

const updateAppointments = async () => {
  try {
    const deliveryPoint = await DeliveryPoint.findOne({ location: "Sucursal Central" });

    if (!deliveryPoint) {
      console.error("No se encontró el punto de entrega");
      return;
    }

    await Appointment.updateMany(
      { deliveryPoint: { $exists: false } }, // Solo actualizar los que no tienen deliveryPoint
      { $set: { deliveryPoint: deliveryPoint._id } }
    );

    console.log("Turnos actualizados exitosamente");
  } catch (error) {
    console.error("Error al actualizar turnos:", error);
  } finally {
    mongoose.disconnect();
  }
};

updateAppointments();
