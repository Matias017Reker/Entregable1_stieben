document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-container');
    const cartCount = document.getElementById('cart-count');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Mostrar productos en el carrito
    if (carrito.length === 0) {
        cartContainer.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío.</p>';
    } else {
    carrito.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'card-carrito';

        const titulo = document.createElement('h4');
        titulo.innerText = producto.nombre;

        const precio = document.createElement('p');
        precio.innerText = `Precio unitario: $${producto.precio}`;

        const cantidad = document.createElement('p');
        cantidad.innerText = `Cantidad: ${producto.cantidad}`;

        const total = document.createElement('p');
        total.innerText = `Total: $${producto.subtotal}`;

        const controles = document.createElement('div');
        controles.className = 'controles-cantidad';

        const botonSumar = document.createElement('button');
        botonSumar.innerText = '+';
        botonSumar.classList.add('btn-cantidad');
        botonSumar.addEventListener('click', () => actualizarCantidad(producto.id, 1));

        const botonRestar = document.createElement('button');
        botonRestar.innerText = '–';
        botonRestar.classList.add('btn-cantidad');
        botonRestar.addEventListener('click', () => actualizarCantidad(producto.id, -1));

controles.append(botonRestar, botonSumar);
card.append(titulo, precio, cantidad, total, controles);
        cartContainer.appendChild(card);
    });
    const botonComprar = document.createElement('button');
    botonComprar.innerText = 'Comprar';
    botonComprar.classList.add('btn-comprar');
    cartContainer.appendChild(botonComprar);
    }

// Actualizar el contador
    const totalItems = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
    if (cartCount) cartCount.textContent = totalItems;
});

function actualizarCantidad(idProducto, cambio) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const index = carrito.findIndex(p => p.id === idProducto);
    if (index !== -1) {
        carrito[index].cantidad += cambio;
        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        } else {
            carrito[index].subtotal = carrito[index].cantidad * carrito[index].precio;
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));
        location.reload();
    }
}
