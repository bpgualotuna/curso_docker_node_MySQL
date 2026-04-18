const express = require("express");
const router = express.Router();
const libroController = require("../controllers/libroController");
const { verificarToken } = require("../middleware/authMiddleware");

router.get("/libros", verificarToken, libroController.getLibros);

router.get("/libros/:id", verificarToken, libroController.getLibroPorId);

router.post("/libros", verificarToken, libroController.crearLibro);

router.delete("/libros/:id", verificarToken, libroController.eliminarLibro);

module.exports = router;
