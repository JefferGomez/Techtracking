// Espera a que toda la página esté lista antes de ejecutar código
document.addEventListener('DOMContentLoaded', function () {

  // --- Botón "Forgot Password?" ---
  // Selecciona el botón con id "forgotBtn" y le agrega un evento de clic
  document.getElementById('forgotBtn').addEventListener('click', function () {
    alert('Redirecting to password recovery...'); // Muestra una alerta
    window.location.href = 'forgot-password.html'; // Redirige a la página de recuperar contraseña
  });

  // --- Botón "Try Logging In Again" ---
  document.getElementById('retryBtn').addEventListener('click', function () {
    window.location.href = 'login.html'; // Redirige al formulario de login
  });

  // --- Botón "Contact Support" ---
  document.getElementById('supportBtn').addEventListener('click', function () {
    window.location.href = 'mailto:support@example.com'; // Abre el cliente de correo con soporte
  });

});
