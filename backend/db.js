const path = require("path");
const { Pool } = require("pg");
const dotenv = require("dotenv");

// Leer el archivo .env desde la carpeta backend
const resultado = dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

// Comprobar que .env pudo cargarse
if (resultado.error) {
  console.error("No se pudo cargar .env:", resultado.error.message);
  process.exit(1);
}

// Verificar que la contraseña exista sin mostrarla
console.log("Archivo .env cargado correctamente");
console.log(
  "DB_PASSWORD está definida:",
  typeof process.env.DB_PASSWORD === "string" &&
    process.env.DB_PASSWORD.length > 0,
);

// Verificar variables necesarias
const requeridas = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];

for (const variable of requeridas) {
  if (!process.env[variable]) {
    throw new Error(`Falta la variable ${variable} en .env`);
  }
}

// Crear conexión PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = pool;
