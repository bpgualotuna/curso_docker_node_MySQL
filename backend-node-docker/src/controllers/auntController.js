const authServices = require("../services/authServices");
const tokenBlacklistRepository = require("../repositories/tockenBlacklisRepository");
const jwt = require("jsonwebtoken");
const secret_key = process.env.JWT_SECRET;

async function registrarUsuario(req, res) {
    try {
        const usuario = await authServices.registrarUsuario(req.body);
        res.status(201).json({ message: "Usuario registrado exitosamente", data:usuario });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function loginUsuario(req, res) {
    try {
        const token = await authServices.loginUsuario(req.body);
        res.status(200).json({ message: "Usuario logueado exitosamente", data:token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function logoutUsuario(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Token no proporcionado" });
    const token = authHeader.split(" ")[1];
    if(!token) return res.status(401).json({ message: "No se proporciono el token" });
    try {
        await tokenBlacklistRepository.agregarToken(token);
        res.status(200).json({ message: "Usuario deslogueado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { registrarUsuario, loginUsuario, logoutUsuario };