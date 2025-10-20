async function enviarCorreo() {
  const correo = document.getElementById("correo").value;


    const response = await fetch("http://localhost:8080/auth/correoRecuperacion",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ correo: correo })
    });

    if (response.ok) {
      document.getElementById("mensaje").textContent = "📩 Revisa tu correo para cambiar la contraseña.";
    } else if (response.status === 404) {
      document.getElementById("mensaje").textContent = "❌ No se encontró un usuario con ese correo.";
    } else {
      document.getElementById("mensaje").textContent = "⚠️ Error al enviar el correo.";
    }
  }