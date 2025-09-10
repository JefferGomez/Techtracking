// Espera a que toda la página esté lista antes de ejecutar código
document.addEventListener('DOMContentLoaded', function () {

  // --- Botón "Forgot Password?" ---
  // Selecciona el botón con id "forgotBtn" y le agrega un evento de clic
  document.getElementById('forgotBtn').addEventListener('click', function () {
    window.location.href = '/auth/CorreoRecuperar'; // Redirige a la página de recuperar contraseña
  });

  // --- Botón "Try Logging In Again" ---
  document.getElementById('retryBtn').addEventListener('click', function () {
    window.location.href = '/'; // Redirige al formulario de login
  });

});
