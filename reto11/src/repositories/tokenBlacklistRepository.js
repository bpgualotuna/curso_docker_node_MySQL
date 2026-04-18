const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Guardar un token revocado
async function agregarToken(token) {
    return await prisma.tokenRevocado.create({ data: { token } });
}

// Verificar si un token está revocado
async function estaRevocado(token) {
    const registro = await prisma.tokenRevocado.findUnique({ where: { token } });
    return !!registro;
}

module.exports = { agregarToken, estaRevocado };
