const express = require("express");
const router = express.Router();
const tareaController = require("../controllers/tareaController");
const { verificarToken } = require("../middleware/authMiddelware");
const { autorizarRoles } = require("../middleware/rolMiddelware");

router.get("/tareas", verificarToken, tareaController.getTareas);

router.delete("/tareas/:id", verificarToken, autorizarRoles("admin"), tareaController.eliminarTarea);

router.post("/tareas", verificarToken, autorizarRoles("admin", "usuario"), tareaController.crearTarea);

module.exports = router;