async function cargarProductos() {
    try {
        const productos = await obtenerProductos();
        renderizarProductos(productos);
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

async function obtenerProductos() {
    const response = await fetch('../data.json');
    return await response.json();
}

function renderizarProductos(productos) {
    container.innerHTML = '';
    productos.forEach(el => crearCard(el));
}

function mostrarToast(mensaje) {
    Toastify({
        text: mensaje,
    }).showToast();
}

cargarProductos();

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function agregarAlCarrito(producto) {
    if (!producto || !producto.id) {
        Toastify({
            text: "El producto es nulo o no tiene un ID válido"
        }).showToast();
        return;
    }

    const { id, nombre, precio } = producto;

    const indexProducto = carrito.findIndex(el => el.id === id);
    if (indexProducto !== -1) {
        carrito[indexProducto].cantidad += 1;
        carrito[indexProducto].subtotal = carrito[indexProducto].cantidad * carrito[indexProducto].precio;
    } else {
        carrito.push({
            id,
            nombre,
            precio,
            cantidad: 1,
            subtotal: precio
        });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();

    Toastify({
        text: "Se agregó el producto al carrito",
        duration: 3000,
        gravity: "bottom",
        position: "right",
        close: true,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)"
        }
    }).showToast();
}

function crearCard(producto) {
    const card = document.createElement("div");
    card.className = "card";

    const titulo = document.createElement("h4");
    titulo.innerText = producto.nombre;

    const precio = document.createElement("p");
    precio.innerText = `$${producto.precio}`;

    const boton = document.createElement("button");
    boton.innerText = "Agregar al carrito";
    boton.classList.add("btn-1");
    boton.onclick = () => agregarAlCarrito(producto);

    const imagen = document.createElement("img");
    imagen.src = producto.imagen;
    imagen.className = "img";

    card.append(imagen, titulo, precio, boton);
    container.append(card);
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorCarrito();
});

function actualizarContadorCarrito() {
    const carritoData = JSON.parse(localStorage.getItem('carrito')) || [];
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const total = carritoData.reduce((acc, prod) => acc + prod.cantidad, 0);
        cartCount.textContent = total;
    }
}

//Carrusel//

let currentIndex = 0;
let productosAuto = [];

function renderCarrusel() {
    const carrusel = document.getElementById("carrusel-container");
    carrusel.innerHTML = "";

    for (let i = 0; i < 3; i++) {
        const index = (currentIndex + i) % productosAuto.length;
        const producto = productosAuto[index];

        const card = document.createElement("div");
        card.className = "card-carrusel";
        if (i === 1) card.classList.add("card-carrusel-centro");

        const img = document.createElement("img");
        img.src = producto.imagen;

        const nombre = document.createElement("h4");
        nombre.textContent = producto.nombre;

        const precio = document.createElement("p");
        precio.textContent = `$${producto.precio}`;

        card.append(img, nombre, precio);
        carrusel.appendChild(card);
    }
}

document.getElementById("prev").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + productosAuto.length) % productosAuto.length;
    renderCarrusel();
});

document.getElementById("next").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % productosAuto.length;
    renderCarrusel();
});

async function cargarCarrusel() {
    const res = await fetch("data.json");
    const data = await res.json();
    productosAuto = data.filter(p => p.categoria === "auto");
    renderCarrusel();
}

document.addEventListener("DOMContentLoaded", cargarCarrusel);