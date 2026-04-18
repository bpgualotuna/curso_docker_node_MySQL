require("dotenv").config();

const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET;

const libroRoutes = require("./routes/libroRoutes");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");

const {apiReference} = require('@scalar/express-api-reference');

const corsOptions = {
    origin: "http://localhost:3000" || process.env.CORS_ORIGIN,
    credentials: true,
};

app.use(express.json());

app.get("/", (req, res) => {
    res.send("API Biblioteca Digital Funcionando");
});

console.log("Registrando rutas /api...");
app.use("/api", libroRoutes);
app.use("/api/auth", authRoutes);

app.use('/reference', apiReference({
    theme: 'dark',
    layout: 'modern',
    spec: {
        url: '/openapi.yaml',
    },
    configuration: {
        showSidebar: true,
        hideDownloadButton: false,
        hideTryItPanel: false,
        authentication: {
            preferredSecurityScheme: 'bearerAuth',
            apiKey: {
                token: 'token',
            }
        }
    },
}));

app.get('/openapi.yaml', (req, res) => {
    res.setHeader('Content-Type', 'application/x-yaml');
    res.sendFile(path.join(__dirname, '..', 'docs', 'openapi.yaml'));
});

console.log("Rutas registradas correctamente");

app.listen(port, () => {
    console.log(`Server escuchando en el puerto: ${port}`);
    console.log(`Documentación disponible en: http://localhost:${port}/reference`);
});
