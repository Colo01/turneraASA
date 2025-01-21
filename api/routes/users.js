// api/routes/users.js

const { Router } = require("express");
const router = Router();
const User = require("../models/User");
const parseId = require("../utils/functions");
//const paginatedResults = require("../utils/pagination");

/* Rutas
(1) Usuario - Modifica sus datos personales.
(2) Usuario - Muestra sus datos personales.
(3) Administrador - Muestra todos los usuarios con el middleware Pagination. (Comentada porque no se utilizaría)
(4) Administrador - Muestra todos los usuarios.
(5) Administrador - Elimina usuarios.
(6) Administrador - Cambia el rol de usuario a operador.
(7) Usuario - Elimina su propia cuenta.
*/

// (1) Usuario - Modifica sus datos personales.
router.put("/me/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Actualizar usuario con validaciones activadas
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body }, // Solo actualizar los campos enviados
      { new: true, runValidators: true } // Devuelve el documento actualizado y aplica validaciones
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ success: true, data: updatedUser });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Manejo de errores de validación
      return res.status(400).json({ error: error.message });
    }

    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
});

// (2) Usuario - Muestra sus datos personales
router.get("/me/:id", (req, res) => {
  const { id } = req.params;

  User.findOne({ _id: id }, (err, result) => {
    if (err) return res.status(500).json({ error: "Error del servidor" });
    if (!result)
      return res.status(404).json({ error: "Usuario no encontrado" });

    res.json(result); // Asegúrate de que todos los campos se envían aquí
  });
});

// (3) Administrador - Muestra todos los usuarios con el middleware Pagination. (Comentada porque no se utilizaría)
/*router.get("/admin/showUsers", paginatedResults(User,3), (req, res) => {
  User.find({}, (err) => {
    if (err) {
      res.json({ error: "Error" });
    } else {
      res.json(res.paginatedResults);
    }
  });
});*/

// (4) Administrador - Muestra todos los usuarios.
router.get("/admin/:adminId/showUsers", async (req, res) => {
  const { adminId } = req.params;
  const userAdmin = await User.findOne({ _id: parseId(adminId) });

  if (userAdmin.admin === true) {
    User.find({}, (err, result) => {
      if (err) {
        res.json({ error: "Error" });
      } else {
        res.json({ data: result });
      }
    });
  } else {
    res.sendStatus(404);
  }
});

// (5) Administrador - Elimina usuarios.
router.delete("/admin/:adminId/delete/:id", async (req, res) => {
  const { adminId } = req.params;
  const userAdmin = await User.findOne({ _id: parseId(adminId) });
  const { id } = req.params;

  try {
    if (userAdmin.admin === true && adminId !== id) {
      await User.deleteOne({ _id: parseId(id) });
      res.sendStatus(204);
    } else if (adminId === id) {
      res.send("You can't remove the permission yourself").status(404);
    }
  } catch {
    res.sendStatus(500);
  }
});

// (6) Administrador - Cambia el rol de usuario a operador.
router.put("/admin/:adminId/role/:id", async (req, res) => {
  const { adminId } = req.params;
  const userAdmin = await User.findOne({ _id: parseId(adminId) });
  const { id } = req.params;

  try {
    if (userAdmin.admin == true && adminId !== id) {
      await User.findOneAndUpdate({ _id: parseId(id) }, [
        { $set: { operator: { $eq: [false, "$operator"] } } },
      ]);
      res.sendStatus(204);
    } else if (adminId == id) {
      res.send("You can't change your role yourself").status(404);
    }
  } catch (error) {
    res.status(404).json(error);
  }
});

// (7) Usuario - Elimina su propia cuenta.
router.delete("/me/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
});

module.exports = router;
