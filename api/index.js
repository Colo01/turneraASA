// api/index.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./routes"); // Importar rutas principales
const authRoutes = require("./routes/auth"); // Importar rutas de autenticación
const deliveryPointRoutes = require("./routes/DeliveryPoint"); // Rutas para puntos de entrega
const appointmentRoutes = require("./routes/appointment"); // Rutas para turnos

require("dotenv").config();

const app = express(); // Inicializar express

// Configuración del middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("tiny"));

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conexión a MongoDB Atlas exitosa"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

// Usar rutas después de inicializar `app`
app.use("/api", routes);
app.use("/api/user", authRoutes);
app.use("/api/deliveryPoint", deliveryPointRoutes);
app.use("/api/appointment", appointmentRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
