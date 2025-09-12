
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (username === "admin" && password === "1234") {
    alert("¡Bienvenido a TechTraking!");
    // Aquí puedes redirigir con: window.location.href = "dashboard.html";
  } else {
    alert("Credenciales incorrectas. Intenta de nuevo.");
  }
});
