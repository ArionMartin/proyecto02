// BOTÓN CARGAR MÁS Y CARGAR MENOS

const loadMoreBtn = document.querySelector("#load-more");

let currentItem = 4;
const cantidadInicial = 4;
const cantidadPorCarga = 4;

if (loadMoreBtn) {
  const boxes = document.querySelectorAll(".box-container .box");

  loadMoreBtn.addEventListener("click", () => {
    // Si todos los productos están visibles, recogerlos
    if (currentItem >= boxes.length) {
      for (let i = cantidadInicial; i < boxes.length; i++) {
        boxes[i].style.display = "none";
      }

      currentItem = cantidadInicial;

      loadMoreBtn.textContent = "Cargar Más";
    } else {
      // Mostrar cuatro productos adicionales
      for (
        let i = currentItem;
        i < currentItem + cantidadPorCarga && i < boxes.length;
        i++
      ) {
        boxes[i].style.display = "inline-block";
      }

      currentItem = Math.min(currentItem + cantidadPorCarga, boxes.length);

      // Cambiar texto al mostrar todos los productos
      if (currentItem >= boxes.length) {
        loadMoreBtn.textContent = "Cargar Menos";
      }
    }
  });
}

// CARRITO DE COMPRAS
const carrito = document.getElementById("carrito");
const elementos1 = document.getElementById("lista-1");
const lista = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.getElementById("vaciar-carrito");

let productosCarrito = [];

// Recuperar carrito guardado
try {
  productosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
  if (!Array.isArray(productosCarrito)) productosCarrito = [];
} catch {
  productosCarrito = [];
}

cargarEventListeners();
actualizarCarrito();

function cargarEventListeners() {
  elementos1.addEventListener("click", modificarProducto);
  elementos1.addEventListener("click", comprarElemento);
  carrito.addEventListener("click", modificarCarrito);
  vaciarCarritoBtn.addEventListener("click", vaciarCarrito);
}

// AGREGAR PRODUCTOS
function comprarElemento(e) {
  const boton = e.target.closest(".agregar-carrito");

  if (!boton) return;

  e.preventDefault();

  const elemento = boton.closest(".box");

  const producto = {
    id: boton.getAttribute("data-id"),
    nombre: elemento.querySelector("h3").textContent,
    precio: Number(
      elemento.querySelector(".precio").textContent.replace(/[^\d]/g, ""),
    ),
    imagen: elemento.querySelector("img").getAttribute("src"),
    cantidad: 1,
  };

  const existente = productosCarrito.find((p) => p.id === producto.id);

  if (existente) {
    existente.cantidad++;
  } else {
    productosCarrito.push(producto);
  }

  actualizarCarrito();
}

// AUMENTAR, DISMINUIR O ELIMINAR
function modificarCarrito(e) {
  const boton = e.target.closest("[data-accion]");

  if (!boton) return;

  e.preventDefault();

  const id = boton.dataset.id;
  const accion = boton.dataset.accion;

  const producto = productosCarrito.find((p) => p.id === id);

  if (!producto) return;

  if (accion === "sumar") {
    producto.cantidad++;
  }

  if (accion === "restar") {
    producto.cantidad--;

    if (producto.cantidad <= 0) {
      productosCarrito = productosCarrito.filter((p) => p.id !== id);
    }
  }

  if (accion === "eliminar") {
    productosCarrito = productosCarrito.filter((p) => p.id !== id);
  }

  actualizarCarrito();
}

// MOSTRAR CARRITO Y CALCULAR TOTAL
function actualizarCarrito() {
  lista.innerHTML = "";

  let total = 0;

  productosCarrito.forEach((producto) => {
    const subtotal = producto.precio * producto.cantidad;

    total += subtotal;

    const fila = document.createElement("tr");

    fila.innerHTML = `
            <td>
                <img src="${producto.imagen}" width="60" alt="">
            </td>

            <td>${producto.nombre}</td>

            <td>
                $${producto.precio.toLocaleString("es-CL")}
            </td>

            <td>
                <div class="cantidad-controles">
                    <button class="cantidad-btn"
                        data-accion="restar"
                        data-id="${producto.id}">−</button>

                    <span>${producto.cantidad}</span>

                    <button class="cantidad-btn"
                        data-accion="sumar"
                        data-id="${producto.id}">+</button>
                </div>
            </td>

            <td>
                $${subtotal.toLocaleString("es-CL")}
            </td>

            <td>
                <a href="#" class="borrar"
                    data-accion="eliminar"
                    data-id="${producto.id}">X</a>
            </td>
        `;

    lista.appendChild(fila);
  });

  // Mostrar el total
  let totalElemento = document.getElementById("total-carrito");

  if (!totalElemento) {
    totalElemento = document.createElement("p");
    totalElemento.id = "total-carrito";
    carrito.appendChild(totalElemento);
  }

  totalElemento.textContent = "Total: $" + total.toLocaleString("es-CL");

  // Actualizar botones de productos

  // Actualizar controles en cada tarjeta de producto
  document.querySelectorAll(".agregar-carrito").forEach((boton) => {
    const id = boton.dataset.id;

    const producto = productosCarrito.find((p) => p.id === id);

    let controles = boton.parentElement.querySelector(".controles-producto");

    if (producto) {
      boton.style.display = "none";

      if (!controles) {
        controles = document.createElement("div");
        controles.className = "controles-producto";

        boton.insertAdjacentElement("afterend", controles);
      }

      controles.innerHTML = `
                <button type="button" class="cantidad-btn"
                    data-accion="restar" data-id="${id}">−</button>

                <span class="cantidad-producto">
                    Agregado ✓ <strong>${producto.cantidad}</strong>
                </span>

                <button type="button" class="cantidad-btn"
                    data-accion="sumar" data-id="${id}">+</button>
            `;
    } else {
      boton.style.display = "inline-block";
      boton.textContent = "Agregar al carrito";
      boton.classList.remove("agregado");

      if (controles) controles.remove();
    }
  });

  // Guardar carrito
  localStorage.setItem("carrito", JSON.stringify(productosCarrito));
}

// VACIAR CARRITO
function vaciarCarrito(e) {
  e.preventDefault();

  productosCarrito = [];

  actualizarCarrito();
}

function modificarProducto(e) {
  const boton = e.target.closest(".controles-producto .cantidad-btn");

  if (!boton) return;

  e.preventDefault();

  const id = boton.dataset.id;
  const accion = boton.dataset.accion;

  const producto = productosCarrito.find((p) => p.id === id);

  if (!producto) return;

  if (accion === "sumar") {
    producto.cantidad++;
  }

  if (accion === "restar") {
    producto.cantidad--;

    if (producto.cantidad <= 0) {
      productosCarrito = productosCarrito.filter((p) => p.id !== id);
    }
  }

  actualizarCarrito();
}

// CONFIGURACIÓN DEL RESTAURANTE
// Sustituye por tu número real, incluyendo código de país.
// Ejemplo para Chile: 56912345678
const whatsappRestaurante = "56979740324";

// ELEMENTOS DEL PEDIDO
const modalPedido = document.getElementById("modal-pedido");
const botonFinalizar = document.getElementById("finalizar-pedido");
const botonCerrar = document.getElementById("cerrar-pedido");
const formularioPedido = document.getElementById("formulario-pedido");
const tipoEntrega = document.getElementById("tipo-entrega");
const campoDireccion = document.getElementById("campo-direccion");
const direccionPedido = document.getElementById("cliente-direccion");

// ABRIR FORMULARIO
botonFinalizar.addEventListener("click", () => {
  if (productosCarrito.length === 0) {
    alert("Primero agrega productos al carrito.");
    return;
  }

  const total = productosCarrito.reduce(
    (suma, producto) => suma + producto.precio * producto.cantidad,
    0,
  );

  document.getElementById("resumen-pedido").textContent =
    "Total del pedido: $" + total.toLocaleString("es-CL");

  modalPedido.hidden = false;
});

// CERRAR FORMULARIO
botonCerrar.addEventListener("click", () => {
  modalPedido.hidden = true;
});

// MOSTRAR DIRECCIÓN SEGÚN ENTREGA
tipoEntrega.addEventListener("change", () => {
  const domicilio = tipoEntrega.value === "Entrega a domicilio";

  campoDireccion.hidden = !domicilio;
  direccionPedido.required = domicilio;

  if (!domicilio) {
    direccionPedido.value = "";
  }
});

// ENVIAR PEDIDO
formularioPedido.addEventListener("submit", (e) => {
  e.preventDefault();

  if (productosCarrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  if (!/^\d{8,15}$/.test(whatsappRestaurante)) {
    alert("Configura primero el WhatsApp del restaurante en script.js");
    return;
  }

  const nombre = document.getElementById("cliente-nombre").value.trim();
  const telefono = document.getElementById("cliente-telefono").value.trim();
  const entrega = tipoEntrega.value;
  const direccion = direccionPedido.value.trim();
  const notas = document.getElementById("pedido-notas").value.trim();

  let mensaje = "*NUEVO PEDIDO - RESTAURANTE*\n\n";
  mensaje += "*Cliente:* " + nombre + "\n";
  mensaje += "*Teléfono:* " + telefono + "\n";
  mensaje += "*Entrega:* " + entrega + "\n";

  if (entrega === "Entrega a domicilio") {
    mensaje += "*Dirección:* " + direccion + "\n";
  }

  mensaje += "\n*PRODUCTOS*\n";

  let total = 0;

  productosCarrito.forEach((producto) => {
    const subtotal = producto.precio * producto.cantidad;
    total += subtotal;

    mensaje += `${producto.cantidad} x ${producto.nombre}`;
    mensaje += ` - $${subtotal.toLocaleString("es-CL")}\n`;
  });

  mensaje += `\n*TOTAL: $${total.toLocaleString("es-CL")}*`;

  if (notas) {
    mensaje += "\n\n*Indicaciones:* " + notas;
  }

  mensaje += "\n\nPor favor, confirmar disponibilidad y precio final.";

  const url =
    "https://wa.me/" +
    whatsappRestaurante +
    "?text=" +
    encodeURIComponent(mensaje);

  window.open(url, "_blank", "noopener,noreferrer");
});

// VOLVER AL RESTAURANTE
const botonVolver = document.getElementById("volver-restaurante");

function cerrarFormularioPedido() {
  modalPedido.hidden = true;
}

// Cerrar con el botón Volver
botonVolver.addEventListener("click", cerrarFormularioPedido);

// Cerrar haciendo clic fuera del formulario
modalPedido.addEventListener("click", (e) => {
  if (e.target === modalPedido) {
    cerrarFormularioPedido();
  }
});

// Cerrar presionando Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modalPedido.hidden) {
    cerrarFormularioPedido();
  }
});
