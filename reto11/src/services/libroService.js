const libroRepository = require("../repositories/libroRepository");

// ── Obtener todos los libros ──
async function getLibros() {
    return await libroRepository.getLibros();
}

// ── Obtener un libro por ID ──
async function getLibroPorId(id) {
    return await libroRepository.getLibroPorId(id);
}

// ── Crear un libro ──
async function crearLibro(data) {
    return await libroRepository.crearLibro(data);
}

// ── Eliminar un libro ──
async function eliminarLibro(id) {
    return await libroRepository.eliminarLibro(id);
}

module.exports = { getLibros, getLibroPorId, crearLibro, eliminarLibro };
