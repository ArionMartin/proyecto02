const pool = require("./db");

async function probarConexion() {
  try {
    const resultado = await pool.query(
      "SELECT current_database() AS base_datos, COUNT(*) AS productos FROM productos",
    );

    console.log("Conexión exitosa");
    console.log(resultado.rows[0]);
  } catch (error) {
    console.error("Error de conexión:");
    console.error("Código:", error.code || "No disponible");
    console.error("Mensaje:", error.message);
  } finally {
    await pool.end();
  }
}

probarConexion();
