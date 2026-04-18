function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function demo() {
    console.log("Iniciando...");
    await esperar(2000);
    console.log("Terminado");
}

demo();

console.log("Fin del programa");