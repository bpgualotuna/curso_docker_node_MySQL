require("dotenv").config();



const express = require("express");
const app = express();
const port = process.env.port || 3000;
const jwtSecret = process.env.JWT_SECRET;

app.use(express.json());




app.get("/", (req, res) => {
    res.send("API Backend Funcionando");
});
console.log("Clave secreta: ", jwtSecret);
console.log("Puerto: ", port);



app.listen(port, () => {
    console.log(`Server escuchando en el puerto: ${port}`);
});