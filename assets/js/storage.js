// Helpers de localStorage: usuarios, sesión y carrito.
const CLAVE_USUARIOS = "huertohogar_usuarios";
const CLAVE_SESION = "huertohogar_sesion";
const CLAVE_CARRITO = "huertohogar_carrito";

function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
}

function guardarUsuarios(usuarios) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

function buscarUsuarioPorEmail(email) {
  const emailBuscado = email.trim().toLowerCase();
  return obtenerUsuarios().find((u) => u.email === emailBuscado) || null;
}

function crearUsuario(usuario) {
  const usuarios = obtenerUsuarios();
  usuarios.push(usuario);
  guardarUsuarios(usuarios);
}

function obtenerSesion() {
  return JSON.parse(localStorage.getItem(CLAVE_SESION));
}

function iniciarSesion(email) {
  localStorage.setItem(
    CLAVE_SESION,
    JSON.stringify({ email: email.trim().toLowerCase(), inicioEn: new Date().toISOString() })
  );
}

function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
}

function obtenerCarrito() {
  return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
}

function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function agregarAlCarrito(codigo, cantidad) {
  const carrito = obtenerCarrito();
  const item = carrito.find((i) => i.codigo === codigo);
  if (item) {
    item.cantidad += cantidad;
  } else {
    carrito.push({ codigo, cantidad });
  }
  guardarCarrito(carrito);
}

function actualizarCantidad(codigo, cantidad) {
  let carrito = obtenerCarrito();
  if (cantidad <= 0) {
    carrito = carrito.filter((i) => i.codigo !== codigo);
  } else {
    const item = carrito.find((i) => i.codigo === codigo);
    if (item) item.cantidad = cantidad;
  }
  guardarCarrito(carrito);
}

function totalUnidadesCarrito() {
  return obtenerCarrito().reduce((total, item) => total + item.cantidad, 0);
}
