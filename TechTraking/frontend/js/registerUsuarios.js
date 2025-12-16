let registrarUsuario = async () => {
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.querySelector("[name='confirmPassword']").value.trim();

  // Validación contraseñas
  if (password !== confirmPassword) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  let campos = {};
  campos.nombre = document.getElementById("NombreC").value.trim();
  campos.id = document.getElementById("Id").value.trim();
  campos.correo = document.getElementById("correo").value.trim();
  campos.contraseña = password;
  campos.rol = { id: parseInt(document.getElementById("rol").value) };

  if (campos.rol.id === 3) {
    campos.tecnico = {
      especialidad: document.getElementById("especialidad").value.trim(),
      telefono: document.getElementById("telefono").value.trim()
    };
  }

  // ✅ Validación de campos vacíos
  if (!campos.nombre || !campos.id || !campos.correo || !campos.contraseña || !campos.rol.id) {
    alert("Por favor completa todos los campos obligatorios.");
    return;
  }

  if (campos.rol.id === 3 && (!campos.tecnico.especialidad || !campos.tecnico.telefono)) {
    alert("Por favor completa los campos de técnico.");
    return;
  }

  // ✅ Solo si pasa la validación, se envía al backend
  try {
    const response = await fetch("http://localhost:8080/superadmin/crearUsuarios", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(campos)
    });

    if (response.ok) {
      window.location.href = "/superadmin/Usuarios";
    } else {
      alert("Error al registrar usuario.");
    }
  } catch (error) {
    alert("Error de conexión con el servidor.");
    console.error(error);
  }
};

document.getElementById("userForm").addEventListener("submit", (e) => {
  e.preventDefault(); // Evita que recargue la página
  registrarUsuario();
});

document.getElementById("rol").addEventListener("change", function () {
  const tecnicoFields = document.getElementById("tecnicoFields");
  const rolSeleccionado = parseInt(this.value);

  if (rolSeleccionado === 3) {
    tecnicoFields.style.display = "block";
  } else {
    tecnicoFields.style.display = "none";
  }
});


