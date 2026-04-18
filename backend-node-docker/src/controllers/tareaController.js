const tareaService = require("../services/tareaService");

async function getTareas(req, res) {

    try {
        const tareas = await tareaService.getTareas();
        console.log(tareas);
        res.status(200).json({ message: "Tareas obtenidas correctamente", data: tareas });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al obtener las tareas" });
    }
}

async function eliminarTarea(req, res) {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({ message: "El ID proporcionado en la URL no es un número válido. Asegúrate de no incluir los dos puntos (:)" });
        }

        const tarea = await tareaService.eliminarTarea(id, req.user.id);
        res.status(200).json({ message: "Tarea eliminada correctamente", data: tarea });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al eliminar la tarea" });
    }
}

async function crearTarea(req, res) {
    try {
        const tarea = await tareaService.crearTarea(req.body, req.user.id);
        res.status(201).json({ message: "Tarea creada correctamente", data: tarea });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al crear la tarea" });
    }
}

module.exports = {
    getTareas,
    eliminarTarea,
    crearTarea
}