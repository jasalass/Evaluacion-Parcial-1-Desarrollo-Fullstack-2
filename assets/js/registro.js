// Regiones y comunas de ejemplo (ciudades donde opera HuertoHogar según el caso).
const REGIONES = {
  "Región Metropolitana de Santiago": ["Santiago", "Providencia"],
  "Región de Valparaíso": ["Valparaíso", "Viña del Mar"],
  "Región del Biobío": ["Concepción", "Nacimiento"],
  "Región de Los Lagos": ["Puerto Montt", "Puerto Varas"],
  "Región de La Araucanía": ["Villarrica", "Temuco"],
};

function poblarRegiones() {
  const selectRegion = document.getElementById("region");
  Object.keys(REGIONES).forEach((region) => {
    const opcion = document.createElement("option");
    opcion.value = region;
    opcion.textContent = region;
    selectRegion.appendChild(opcion);
  });
}

function poblarComunas() {
  const region = document.getElementById("region").value;
  const selectComuna = document.getElementById("comuna");
  selectComuna.innerHTML = '<option value="">Seleccione comuna</option>';
  (REGIONES[region] || []).forEach((comuna) => {
    const opcion = document.createElement("option");
    opcion.value = comuna;
    opcion.textContent = comuna;
    selectComuna.appendChild(opcion);
  });
}

function mostrarError(idCampo, mensaje) {
  document.getElementById(`error-${idCampo}`).textContent = mensaje;
}

function limpiarErrores() {
  document.querySelectorAll(".error-campo").forEach((el) => (el.textContent = ""));
}

function validarRegistro(datos) {
  let esValido = true;

  if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ ]{1,50}$/.test(datos.nombre.trim())) {
    mostrarError("nombre", "Solo letras y espacios, máximo 50 caracteres.");
    esValido = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) {
    mostrarError("email", "Ingresa un correo con formato válido.");
    esValido = false;
  } else if (buscarUsuarioPorEmail(datos.email)) {
    mostrarError("email", "Ya existe una cuenta con este correo.");
    esValido = false;
  }

  if (datos.confirmarEmail !== datos.email) {
    mostrarError("confirmarEmail", "Los correos no coinciden.");
    esValido = false;
  }

  const passwordValida = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%!.*]).{8,}$/.test(datos.password);
  if (!passwordValida) {
    mostrarError(
      "password",
      "Mínimo 8 caracteres, con mayúscula, minúscula, número y símbolo (@#$%!.*)."
    );
    esValido = false;
  }

  if (datos.confirmarPassword !== datos.password) {
    mostrarError("confirmarPassword", "Las contraseñas no coinciden.");
    esValido = false;
  }

  if (datos.telefono) {
    const telefonoLimpio = datos.telefono.replace(/\s+/g, "");
    if (!/^(\+?56)?9\d{8}$/.test(telefonoLimpio)) {
      mostrarError("telefono", "Formato de móvil chileno inválido (ej: +56912345678).");
      esValido = false;
    }
  }

  if (!datos.region) {
    mostrarError("region", "Selecciona una región.");
    esValido = false;
  }

  if (!datos.comuna) {
    mostrarError("comuna", "Selecciona una comuna.");
    esValido = false;
  }

  return esValido;
}

function manejarRegistro(evento) {
  evento.preventDefault();
  limpiarErrores();

  const datos = {
    nombre: document.getElementById("nombre").value,
    email: document.getElementById("email").value.trim().toLowerCase(),
    confirmarEmail: document.getElementById("confirmarEmail").value.trim().toLowerCase(),
    password: document.getElementById("password").value,
    confirmarPassword: document.getElementById("confirmarPassword").value,
    telefono: document.getElementById("telefono").value.trim(),
    region: document.getElementById("region").value,
    comuna: document.getElementById("comuna").value,
  };

  if (!validarRegistro(datos)) return;

  crearUsuario({
    nombre: datos.nombre.trim(),
    email: datos.email,
    password: datos.password,
    telefono: datos.telefono || null,
    region: datos.region,
    comuna: datos.comuna,
    creadoEn: new Date().toISOString(),
  });

  document.getElementById("formulario-registro").classList.add("d-none");
  document.getElementById("mensaje-exito").classList.remove("d-none");
}

document.addEventListener("DOMContentLoaded", () => {
  poblarRegiones();
  document.getElementById("region").addEventListener("change", poblarComunas);
  document.getElementById("formulario-registro").addEventListener("submit", manejarRegistro);
});
