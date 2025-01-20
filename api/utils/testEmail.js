const nodemailer = require("nodemailer");
//////////////////////////////// SCRIPT DE TESTEO DEL NODEMAILER, SCRIPT DE TESTEO ////////////////////////////////////////
//////////////////////////////// SCRIPT DE TESTEO DEL NODEMAILER, SCRIPT DE TESTEO ////////////////////////////////////////
//////////////////////////////// SCRIPT DE TESTEO DEL NODEMAILER, SCRIPT DE TESTEO ////////////////////////////////////////
//////////////////////////////// SCRIPT DE TESTEO DEL NODEMAILER, SCRIPT DE TESTEO ////////////////////////////////////////
// Configuración de nodemailer con Gmail
const transporter = nodemailer.createTransport({
  service: "gmail", // Usar Gmail como servicio
  auth: {
    user: "ptester1011@gmail.com", // Reemplaza con tu correo
    pass: "maje wvvj emez ckgk", // Reemplaza con la contraseña de aplicación
  },
});

// Datos del correo
const mailOptions = {
  from: "ptester1011@gmail.com", // Correo del remitente
  to: "cvlytoxd@gmail.com", // Correo del destinatario
  subject: "Prueba de envío con Gmail", // Asunto del correo
  text: "¡Hola! Este es un correo de prueba enviado desde nodemailer usando Gmail.", // Cuerpo del correo
};

// Enviar el correo
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Error al enviar el correo:", error);
  } else {
    console.log("Correo enviado:", info.response);
  }
});
