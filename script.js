let loadMoreBtn = document.querySelector("#load-more");
let currentItem =4;
loadMoreBtn.onclick = () =>{
    let boxes = [...document.querySelectorAll('.box-container .box')];
    for(var i = currentItem; i< currentItem + 4; i++){
        boxes[i].style.display = 'inline-block';
    }
    currentItem += 4;
    if(currentItem >= boxes.length){
        loadMoreBtn.style.display = 'none';
    }
}

//Carrito 

const carrito = document.getElementById('carrito');
const elementos1 = document.getElementById('lista-1');
const lista = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document-getElementById('vaciar-carrito');

cargarEventListener();

function cargarEventListener(){
    elementos1.addEventListener('click', comprarElemento);
    carrito.addEventListener('click', eliminarElemento);
}