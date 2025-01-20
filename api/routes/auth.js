require("dotenv").config();
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const { sendRegistrationEmail } = require("../utils/send_email_service"); // Importar el servicio de envío de correos

/*
(1) Usuario - Login.
(2) Usuario - Register.
*/

const schemaRegister = Joi.object({
  fname: Joi.string().min(3).max(255).required(),
  lname: Joi.string().min(2).max(255).required(),
  dni: Joi.number()
    .integer()
    .min(1000000) // Mínimo 7 dígitos (1 millón)
    .max(99999999) // Máximo 8 dígitos (99 millones)
    .required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(8).max(1024).required(),
  studentNumber: Joi.number().integer().min(1).max(99999).required(),
  address: Joi.string().min(8).max(255).required(),
  career: Joi.string().max(40).required(),
  story: Joi.string().optional(), // No se guarda en la base de datos
  birthdate: Joi.date()
    .max("now") // No permitir fechas futuras
    .min(new Date(new Date().setFullYear(new Date().getFullYear() - 100))) // No permitir más de 100 años atrás
    .required(), // Fecha de nacimiento
});

const schemaLogin = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(4).max(1024).required(),
});

// (1) Usuario - Login.
router.post("/login", async (req, res) => {
  //validaciones de usuario (ingreso)
  const { error } = schemaLogin.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(400)
      .json({ error: true, mensaje: "Email no registrado" });

  const passValida = await bcrypt.compare(req.body.password, user.password);
  if (!passValida)
    return res.status(400).json({ error: true, mensaje: "Contraseña errónea" });

  //crear token
  const token = jwt.sign(
    {
      id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      dni: user.dni,
      admin: user.admin,
      operator: user.operator,
      branchOffice: user.branchOffice,
    },
    process.env.TOKEN_SECRET
  );

  res.header("auth-token", token).json({
    error: null,
    data: { token },
  });
});

// (2) Usuario - Register
router.post("/register", async (req, res) => {
  console.log("Datos recibidos en /register:", req.body); // Log datos entrantes

  // Validaciones de usuarios (registro)
  const { error } = schemaRegister.validate(req.body);
  if (error) {
    console.error("Error de validación:", error.details[0].message); // Log del error
    return res.status(400).json({ error: error.details[0].message });
  }

  const existeEmail = await User.findOne({ email: req.body.email });
  if (existeEmail) {
    console.warn("Email ya registrado:", req.body.email); // Log si el email ya existe
    return res
      .status(400)
      .json({ error: true, mensaje: "Email ya registrado" });
  }

  const existeDni = await User.findOne({ dni: req.body.dni });
  if (existeDni) {
    console.warn("DNI ya registrado:", req.body.dni); // Log si el DNI ya existe
    return res.status(400).json({ error: true, mensaje: "DNI ya registrado" });
  }

  // Hash contraseña
  const saltos = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, saltos);

  const user = new User({
    fname: req.body.fname,
    lname: req.body.lname,
    dni: req.body.dni,
    email: req.body.email,
    password: password,
    studentNumber: req.body.studentNumber,
    address: req.body.address,
    career: req.body.career,
    birthdate: req.body.birthdate,
  });

  try {
    const userDB = await user.save();
    console.log("Usuario registrado exitosamente:", userDB); // Log usuario registrado

    // Enviar correo de confirmación de registro
    await sendRegistrationEmail(userDB.email, userDB.fname);

    res.json({
      success: true,
      msg: "Registrado correctamente",
      error: null,
      data: userDB,
    });
  } catch (error) {
    console.error("Error al guardar el usuario:", error); // Log del error
    res.status(400).json(error);
  }
});

module.exports = router;
