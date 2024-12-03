// api/config/emailer.js

const nodemailer = require("nodemailer");
const htmlTemplate = require("./html");

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "96ba089fb4f5a6",
    pass: "92e1ca3bfab405"
  }
});

module.exports = transport;