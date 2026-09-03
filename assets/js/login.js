function manejarLogin(evento) {
  evento.preventDefault();
  document.querySelectorAll(".error-campo").forEach((el) => (el.textContent = ""));

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById("error-email").textContent = "Ingresa un correo con formato válido.";
    return;
  }
  if (!password) {
    document.getElementById("error-password").textContent = "La contraseña es obligatoria.";
    return;
  }

  const usuario = buscarUsuarioPorEmail(email);
  if (!usuario) {
    document.getElementById("error-email").textContent = "No existe una cuenta con este correo.";
    return;
  }
  if (usuario.password !== password) {
    document.getElementById("error-password").textContent = "Contraseña incorrecta.";
    return;
  }

  iniciarSesion(email);
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("formulario-login").addEventListener("submit", manejarLogin);
});
