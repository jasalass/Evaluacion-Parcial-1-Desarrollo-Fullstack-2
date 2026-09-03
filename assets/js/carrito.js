let descuento = 0;

function calcularSubtotal() {
  return obtenerCarrito().reduce((total, item) => {
    const producto = buscarProducto(item.codigo);
    return total + (producto ? producto.precio * item.cantidad : 0);
  }, 0);
}

function pintarCarrito() {
  const carrito = obtenerCarrito();
  const contenedor = document.getElementById("lista-carrito");

  if (carrito.length === 0) {
    contenedor.innerHTML = `
      <div class="alert alert-info">
        Tu carrito está vacío. <a href="index.html#catalogo">Volver al catálogo</a>.
      </div>`;
  } else {
    contenedor.innerHTML = carrito
      .map((item) => {
        const p = buscarProducto(item.codigo);
        if (!p) return "";
        return `
          <article class="card mb-3">
            <div class="row g-0 align-items-center">
              <div class="col-3">
                <img src="${p.imagen}" class="img-fluid rounded-start imagen-mini" alt="${p.nombre}">
              </div>
              <div class="col-9">
                <div class="card-body">
                  <h3 class="h6 mb-1">${p.nombre}</h3>
                  <p class="small text-muted mb-1">${p.descripcion}</p>
                  <p class="fw-bold mb-2">$${p.precio.toLocaleString("es-CL")}</p>
                  <div class="input-group input-group-sm" style="max-width: 150px;">
                    <button class="btn btn-outline-secondary" type="button" onclick="cambiarCantidad('${p.codigo}', ${item.cantidad - 1})">-</button>
                    <input type="number" class="form-control text-center" value="${item.cantidad}" min="0"
                      onchange="cambiarCantidad('${p.codigo}', this.valueAsNumber)">
                    <button class="btn btn-outline-secondary" type="button" onclick="cambiarCantidad('${p.codigo}', ${item.cantidad + 1})">+</button>
                  </div>
                </div>
              </div>
            </div>
          </article>`;
      })
      .join("");
  }

  actualizarTotal();
  actualizarContadorCarrito();
}

function cambiarCantidad(codigo, cantidad) {
  actualizarCantidad(codigo, cantidad);
  pintarCarrito();
}

function actualizarTotal() {
  const subtotal = calcularSubtotal();
  const total = Math.max(subtotal - descuento, 0);
  document.getElementById("total-carrito").textContent = `$${total.toLocaleString("es-CL")}`;
}

function aplicarCupon() {
  const codigo = document.getElementById("cupon").value.trim().toUpperCase();
  const mensaje = document.getElementById("mensaje-cupon");
  const porcentaje = CUPONES[codigo];

  if (!porcentaje) {
    descuento = 0;
    mensaje.textContent = "Cupón inválido.";
    mensaje.className = "small mt-1 text-danger";
  } else {
    descuento = calcularSubtotal() * porcentaje;
    mensaje.textContent = `Cupón aplicado: -${porcentaje * 100}%`;
    mensaje.className = "small mt-1 text-success";
  }
  actualizarTotal();
}

function pagar() {
  const mensaje = document.getElementById("mensaje-pago");

  if (obtenerCarrito().length === 0) {
    mensaje.textContent = "Tu carrito está vacío, agrega productos antes de pagar.";
    mensaje.className = "mt-2 text-danger";
    return;
  }

  guardarCarrito([]);
  descuento = 0;
  document.getElementById("cupon").value = "";
  document.getElementById("mensaje-cupon").textContent = "";
  mensaje.textContent = "¡Pedido confirmado! (pago simulado, sin pasarela real)";
  mensaje.className = "mt-2 text-success";
  pintarCarrito();
}

document.addEventListener("DOMContentLoaded", () => {
  pintarCarrito();
  document.getElementById("btn-cupon").addEventListener("click", aplicarCupon);
  document.getElementById("btn-pagar").addEventListener("click", pagar);
});
