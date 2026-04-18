const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getTareas() {
    return await prisma.tarea.findMany();
}

async function eliminarTarea(id, usuarioId) {
    return await prisma.tarea.delete({ where: { id, usuarioId } });
}

async function crearTarea(data, usuarioId) {
    return await prisma.tarea.create({ data: { ...data, usuarioId } });
}

module.exports = {
    getTareas,
    eliminarTarea,
    crearTarea
}