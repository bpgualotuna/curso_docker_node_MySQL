const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function agregarToken(token) {
    return await prisma.tokenRevocado.create({ data: { token } });
}

async function estaRevocado(token) {
    const registro = await prisma.tokenRevocado.findUnique({ where: { token } });
    return !!registro;
}

module.exports = { agregarToken, estaRevocado };