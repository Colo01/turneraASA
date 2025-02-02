// api/routes/validate-token.js

const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ error: "Acceso denegado" });

  try {
    const verificar = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verificar;
    next();
  } catch (error) {
    res.status(400).json({ error: "Token no valido" });
  }
};

module.exports = verifyToken;
