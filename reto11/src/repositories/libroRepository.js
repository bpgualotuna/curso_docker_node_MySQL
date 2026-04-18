const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Obtener todos los libros
async function getLibros() {
    return await prisma.libro.findMany();
}

// Obtener un libro por ID
async function getLibroPorId(id) {
    return await prisma.libro.findUnique({ where: { id } });
}

// Crear un libro
async function crearLibro(data) {
    return await prisma.libro.create({ data });
}

// Eliminar un libro por ID
async function eliminarLibro(id) {
    return await prisma.libro.delete({ where: { id } });
}

module.exports = { getLibros, getLibroPorId, crearLibro, eliminarLibro };
