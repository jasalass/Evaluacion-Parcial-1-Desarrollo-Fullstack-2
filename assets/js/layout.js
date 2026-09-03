// Mantiene el indicador Cart (n) del header al día en las 4 páginas.
// Criterio de conteo: suma de unidades en el carrito (no cantidad de líneas).
function actualizarContadorCarrito() {
  const contador = document.getElementById("contador-carrito");
  if (contador) {
    contador.textContent = `Cart (${totalUnidadesCarrito()})`;
  }
}

document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);
