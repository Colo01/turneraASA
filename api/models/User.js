// api/models/User.js

const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    fname: {
      type: String,
      required: true,
      lowercase: true,
      minlength: 3,
      maxlength: 255,
    },
    lname: {
      type: String,
      required: true,
      lowercase: true,
      minlength: 2,
      maxlength: 255,
    },
    dni: {
      type: Number,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      minlength: 6,
      maxlength: 255,
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 255,
    },
    studentNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 99999, // Validación para máximo de 5 cifras
    },
    address: {
      type: String,
      required: true,
      lowercase: true,
      minlength: 8,
      maxlength: 255,
    },
    career: {
      type: String,
      required: true,
      maxlength: 40, // Limitar el campo a 40 caracteres
    },
    admin: {
      type: Boolean,
      required: false,
      default: false,
    },
    operator: {
      type: Boolean,
      required: false,
      default: false,
    },
    phone: {
      type: String,
      required: false,
      lowercase: true,
      minlength: 7,
      maxlength: 25,
    },
    birthdate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "La fecha de nacimiento no puede ser futura.",
      },
    },
    resetLink: { type: String, default: "" }, // Guarda el token de recupero de contraseña
    branchOffice: [
      {
        type: Schema.Types.ObjectId,
        ref: "BranchOffice",
      },
    ],
    appointment: [
      {
        type: Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
    story: {
      type: String,
      default: null, // Permite que sea opcional
      maxlength: 500, // Máximo de caracteres permitido
    },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
