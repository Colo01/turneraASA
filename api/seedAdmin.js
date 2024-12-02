const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User"); // Asegúrate de que la ruta sea correcta
require("dotenv").config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB", err));

// Crear el usuario administrador
async function createAdmin() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("admin123", salt);

  const adminUser = new User({
    fname: "Admin",
    lname: "User",
    dni: 12345678,
    email: "admin@example.com",
    password: hashedPassword,
    admin: true,
    operator: false,
  });

  try {
    await adminUser.save();
    console.log("Usuario administrador creado con éxito");
    mongoose.disconnect();
  } catch (err) {
    console.error("Error al crear el usuario administrador", err);
    mongoose.disconnect();
  }
}

createAdmin();
