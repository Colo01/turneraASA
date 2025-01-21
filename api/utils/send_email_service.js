// Importar Nodemailer
const nodemailer = require("nodemailer");

// Configuración del servicio de correo
const transporter = nodemailer.createTransport({
  service: "gmail", // Usar Gmail como servicio
  auth: {
    user: "ptester1011@gmail.com", // Reemplaza con tu correo
    pass: "maje wvvj emez ckgk", // Reemplaza con la contraseña de aplicación
  },
});

// Función para enviar correo después del registro
const sendRegistrationEmail = async (toEmail, userName) => {
  try {
    const mailOptions = {
      from: "ptester1011@gmail.com", // Correo del remitente
      to: toEmail, // Correo del destinatario
      subject: "¡Registro Exitoso!", // Asunto del correo
      html: `
        <h1>¡Hola ${userName}!</h1>
        <p>Tu registro en nuestro sistema fue exitoso. Ahora puedes acceder y disfrutar de todas las funcionalidades.</p>
        <p>Gracias por unirte a nosotros.</p>
        <p>NO CONTESTAR ESTE CORREO.</p>
      `, // Cuerpo del correo
    };

    await transporter.sendMail(mailOptions); // Enviar el correo
    console.log("Correo de registro enviado exitosamente.");
  } catch (error) {
    console.error("Error al enviar el correo de registro:", error);
    throw error; // Propagar el error para manejarlo en el llamado
  }
};

// Función para enviar correo de confirmación de turno
const sendAppointmentEmail = async (toEmail, appointmentDetails) => {
  try {
    console.log("Detalles de la cita para el correo:", appointmentDetails); // Debug

    const shortId = appointmentDetails.id.slice(-4); // ahora este string deberia andar perri

    const mailOptions = {
      from: "ptester1011@gmail.com",
      to: toEmail,
      subject: "Confirmación de Turno",
      html: `
        <h1>¡Confirmación de Turno en ASA!</h1>
        <p>Tu turno ha sido reservado con éxito. Aquí están los detalles:</p>
        <ul>
          <li><strong>ID:</strong> ${shortId}</li>
          <li><strong>Fecha:</strong> ${appointmentDetails.date}</li>
          <li><strong>Hora:</strong> ${appointmentDetails.time}</li>
          <li><strong>Estado:</strong> ${appointmentDetails.state}</li>
          <li><strong>Sucursal:</strong> ${appointmentDetails.branch}</li>
        </ul>
        <p>Por favor, asegúrate de presentarte a tiempo.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente.");
  } catch (error) {
    console.error("Error al enviar correo:", error);
    throw error;
  }
};

module.exports = {
  sendRegistrationEmail,
  sendAppointmentEmail,
};
