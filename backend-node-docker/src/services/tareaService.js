const tareaRepository = require("../repositories/tareaRepository");

async function getTareas() {
    return await tareaRepository.getTareas();
}

async function eliminarTarea(id, usuarioId){
    return await tareaRepository.eliminarTarea(id, usuarioId);
}

async function crearTarea(data, usuarioId){
    return await tareaRepository.crearTarea(data, usuarioId);
}

module.exports = {
    getTareas,
    eliminarTarea,
    crearTarea
}