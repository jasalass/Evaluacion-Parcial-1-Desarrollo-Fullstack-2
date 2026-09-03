function pintarProductos() {
  const contenedor = document.getElementById("lista-productos");
  contenedor.innerHTML = PRODUCTOS.map(
    (p) => `
    <div class="col-6 col-md-4 col-lg-3">
      <article class="card h-100">
        <img src="${p.imagen}" class="card-img-top imagen" alt="${p.nombre}">
        <div class="card-body d-flex flex-column">
          <h3 class="h6">${p.nombre}</h3>
          <p class="small text-muted mb-1">${p.atributo}</p>
          <p class="fw-bold mb-2">$${p.precio.toLocaleString("es-CL")} / ${p.unidad}</p>
          <button class="btn btn-success btn-sm mt-auto" onclick="agregarProducto('${p.codigo}')">
            Agregar al carrito
          </button>
        </div>
      </article>
    </div>`
  ).join("");
}

function agregarProducto(codigo) {
  agregarAlCarrito(codigo, 1);
  actualizarContadorCarrito();
}

function manejarBoletin(evento) {
  evento.preventDefault();
  const input = document.getElementById("email-boletin");
  const mensaje = document.getElementById("mensaje-boletin");
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);

  if (!emailValido) {
    mensaje.textContent = "Ingresa un correo válido.";
    mensaje.className = "small mt-1 text-danger";
    return;
  }

  mensaje.textContent = "¡Gracias por suscribirte!";
  mensaje.className = "small mt-1 text-success";
  input.value = "";
}

document.addEventListener("DOMContentLoaded", () => {
  pintarProductos();
  document.getElementById("form-boletin").addEventListener("submit", manejarBoletin);
});
