const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Crear un usuario en la BD
async function crearUsuario(data) {
    return await prisma.usuario.create({ data });
}

// Buscar un usuario por email
async function obtenerPorEmail(email) {
    return await prisma.usuario.findUnique({ where: { email } });
}

module.exports = { crearUsuario, obtenerPorEmail };
