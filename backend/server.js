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

app.post("/api/pedidos", async (req, res) => {
  const { nombre, telefono, tipo_entrega, direccion, indicaciones, productos } =
    req.body;

  if (
    typeof nombre !== "string" ||
    !nombre.trim() ||
    typeof telefono !== "string" ||
    !telefono.trim() ||
    !["Retiro en restaurante", "Entrega a domicilio"].includes(tipo_entrega) ||
    !Array.isArray(productos) ||
    productos.length === 0 ||
    productos.length > 100 ||
    (tipo_entrega === "Entrega a domicilio" &&
      (typeof direccion !== "string" || !direccion.trim()))
  ) {
    return res.status(400).json({
      error: "Datos del pedido incompletos o inválidos",
    });
  }

  const cantidades = new Map();

  for (const producto of productos) {
    if (
      !Number.isSafeInteger(producto.id) ||
      producto.id <= 0 ||
      !Number.isSafeInteger(producto.cantidad) ||
      producto.cantidad < 1 ||
      producto.cantidad > 100
    ) {
      return res.status(400).json({
        error: "Producto o cantidad inválida",
      });
    }

    cantidades.set(
      producto.id,
      (cantidades.get(producto.id) || 0) + producto.cantidad,
    );

    if (cantidades.get(producto.id) > 100) {
      return res.status(400).json({
        error: "Cantidad máxima superada",
      });
    }
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const ids = [...cantidades.keys()];

    const consulta = await client.query(
      `SELECT id, nombre, precio
             FROM productos
             WHERE id = ANY($1::integer[])
               AND disponible = TRUE`,
      [ids],
    );

    if (consulta.rows.length !== ids.length) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        error: "Hay productos no disponibles",
      });
    }

    const detalles = consulta.rows.map((p) => ({
      id: p.id,
      cantidad: cantidades.get(p.id),
      precio: Number(p.precio),
    }));

    const total = detalles.reduce((suma, p) => suma + p.precio * p.cantidad, 0);

    const cliente = await client.query(
      `INSERT INTO clientes (nombre, telefono)
             VALUES ($1, $2) RETURNING id`,
      [nombre.trim(), telefono.trim()],
    );

    const pedido = await client.query(
      `INSERT INTO pedidos
             (cliente_id, tipo_entrega, direccion, indicaciones, total)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, fecha, estado, total`,
      [
        cliente.rows[0].id,
        tipo_entrega,
        tipo_entrega === "Entrega a domicilio" ? direccion.trim() : null,
        indicaciones || null,
        total,
      ],
    );

    for (const p of detalles) {
      await client.query(
        `INSERT INTO detalle_pedido
                 (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
                 VALUES ($1, $2, $3, $4, $5)`,
        [pedido.rows[0].id, p.id, p.cantidad, p.precio, p.precio * p.cantidad],
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      mensaje: "Pedido registrado correctamente",
      pedido: pedido.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK").catch(console.error);
    console.error("Error al registrar pedido:", error.message);

    res.status(500).json({
      error: "No se pudo registrar el pedido",
    });
  } finally {
    client.release();
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
