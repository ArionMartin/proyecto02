const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const pool = require("./db");
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

// OBTENER PRODUCTOS DESDE POSTGRESQL
app.get("/api/productos", async (req, res) => {
  try {
    const resultado = await pool.query(`
            SELECT id, nombre, descripcion, precio, imagen, disponible
            FROM productos
            ORDER BY id
        `);

    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al consultar productos:", error.message);

    res.status(500).json({
      error: "No se pudieron obtener los productos",
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
