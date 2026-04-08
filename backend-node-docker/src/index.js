const express = require("express");
const app = express();

app.use(express.json());




app.get("/", (req, res) => {
    res.send("API Backend Funcionando");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server escuchando en el puerto: ${PORT}`);
});