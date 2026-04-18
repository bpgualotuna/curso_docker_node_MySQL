const jwt = require("jsonwebtoken");
const tokenBlacklistRepository = require("../repositories/tokenBlacklistRepository");
const secret_key = process.env.JWT_SECRET;

async function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Token no proporcionado" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No se proporcionó el token" });

    const revocado = await tokenBlacklistRepository.estaRevocado(token);
    if (revocado) return res.status(401).json({ message: "Token revocado" });

    try {
        const decoded = jwt.verify(token, secret_key);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: "Token inválido" });
    }
}

module.exports = { verificarToken };
