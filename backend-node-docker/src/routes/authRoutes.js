const express = require("express");
const router = express.Router();
const authController = require("../controllers/auntController");



router.post("/register", authController.registrarUsuario);
router.post("/login", authController.loginUsuario);
router.post("/logout", authController.logoutUsuario);

module.exports = router;