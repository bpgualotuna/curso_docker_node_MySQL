const libroService = require("../services/libroService");

// ── Obtener todos los libros ──
async function getLibros(req, res) {
    try {
        const libros = await libroService.getLibros();
        res.status(200).json({ message: "Libros obtenidos correctamente", data: libros });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los libros" });
    }
}

// ── Obtener un libro por ID ──
async function getLibroPorId(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "El ID no es un número válido" });
        }
        const libro = await libroService.getLibroPorId(id);
        if (!libro) {
            return res.status(404).json({ message: "Libro no encontrado" });
        }
        res.status(200).json({ message: "Libro obtenido correctamente", data: libro });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el libro" });
    }
}

// ── Crear libro ──
async function crearLibro(req, res) {
    try {
        const libro = await libroService.crearLibro(req.body);
        res.status(201).json({ message: "Libro creado correctamente", data: libro });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el libro" });
    }
}

// ── Eliminar libro ──
async function eliminarLibro(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "El ID no es un número válido" });
        }
        const libro = await libroService.eliminarLibro(id);
        res.status(200).json({ message: "Libro eliminado correctamente", data: libro });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el libro" });
    }
}

module.exports = { getLibros, getLibroPorId, crearLibro, eliminarLibro };
