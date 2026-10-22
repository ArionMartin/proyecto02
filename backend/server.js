const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Permitir recibir información JSON
app.use(express.json());

// Servir los archivos de la página web
app.use(express.static(path.join(__dirname, "..")));

// Ruta para comprobar el servidor
app.get("/api/estado", (req, res) => {
  res.json({
    mensaje: "Servidor del restaurante funcionando",
    estado: "activo",
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
