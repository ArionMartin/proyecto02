

// Botón "Cargar más" 
let loadMoreBtn = document.querySelector('#load-more');
let currentItem = 4;


loadMoreBtn.onclick = () => {
    let boxes = [...document.querySelectorAll('.box-container .box')]; // Selector corregido
    for (let i = currentItem; i < currentItem + 4 && i < boxes.length; i++) {
        boxes[i].style.display = 'inline-block';
    }
    currentItem += 4;

    if (currentItem >= boxes.length) { // Condición corregida
        loadMoreBtn.style.display = 'none';
    }
};

// Carrito
const carrito = document.getElementById('carrito'); // Corregido el ID sin '#'
const elementos1 = document.getElementById('lista-1');
const lista = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');

cargarEventListeners();

function cargarEventListeners() {
    elementos1.addEventListener('click', comprarElemento);
    carrito.addEventListener('click', eliminarElemento);
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
}

function comprarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const elemento = e.target.parentElement.parentElement;
        leerDatosElemento(elemento);
    }
}

function leerDatosElemento(elemento) {
    const infoProducto = {
        imagen: elemento.querySelector('img').src,
        nombre: elemento.querySelector('h3').textContent,
        precio: elemento.querySelector('.precio').textContent, // Corregido paréntesis extra
        id: elemento.querySelector('a').getAttribute('data-id')
    }
    insertarCarrito(infoProducto);
}

function insertarCarrito(producto) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <img src="${producto.imagen}" width="100" />
        </td>
        <td>
            ${producto.nombre} <!-- Corregido a producto.nombre -->
        </td>
        <td>
            ${producto.precio} <!-- Corregido a producto.precio -->
        </td>
        <td>
            <a href="#" class="borrar" data-id="${producto.id}">X</a>
        </td>
    `;

    lista.appendChild(row);
}



function eliminarElemento(e){
    e.preventDefault();
    if (e.target.classList.contains('borrar')){
        e.target.parentElement.parentElement.remove();
    }
}


function vaciarCarrito(){
    while(lista.firstChild){
        lista.removeChild(lista.firstChild);
        
    }
    return false;
}




