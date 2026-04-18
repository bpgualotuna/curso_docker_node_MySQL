const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function crearUsuario(data) {
    return await prisma.usuario.create({ data });
}

async function obtenerPorEmail(email) {
    return await prisma.usuario.findUnique({ where: { email } });
}


module.exports = { crearUsuario, obtenerPorEmail };
