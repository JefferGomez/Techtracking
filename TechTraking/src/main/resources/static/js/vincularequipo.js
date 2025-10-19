function buscarCliente() {
  const query = document.getElementById("buscarCliente").value;

  fetch(`/admin/clientes/buscar?query=${encodeURIComponent(query)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Error en la búsqueda");
      }
      return response.json();
    })
    .then(cliente => {
      if (cliente) {
        // Guardamos el ID del cliente para usarlo al vincular equipo
        sessionStorage.setItem("clienteId", cliente.id);

        // Mostramos la info en pantalla
        document.getElementById("NIT").textContent = cliente.id;
        document.getElementById("Empresa").textContent = cliente.nombre;
        document.getElementById("Dirección").textContent = cliente.direccion;
        document.getElementById("Teléfono").textContent = cliente.telefono;
        document.getElementById("Correo").textContent = cliente.correo;
      } else {
        alert("❌ Cliente no encontrado.");
      }
    })
    .catch(error => {
      console.error(error);
      alert("Ocurrió un error al buscar cliente.");
    });
}

function vincularEquipo() {
  const clienteId = sessionStorage.getItem("clienteId");

  if (!clienteId) {
    alert("Primero debe buscar y seleccionar un cliente.");
    return;
  }

  // Leer todos los datos del formulario, incluyendo el ID manual
  const equipo = {
    id: parseInt(document.getElementById("idEquipo").value),
    marca: document.getElementById("nombreEquipo").value,
    modelo: document.getElementById("modelo").value,
    serie: document.getElementById("serie").value,
    tipo: document.getElementById("tipo").value,
    clienteId: parseInt(clienteId)
  };

  fetch("/admin/equipos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(equipo)
  })
    .then(response => {
      if (!response.ok) throw new Error("Error al vincular equipo");
      return response.json();
    })
    .then(data => {
      alert("✅ Equipo vinculado exitosamente");
      // Puedes limpiar los campos si lo deseas:
      document.getElementById("idEquipo").value = "";
      document.getElementById("nombreEquipo").value = "";
      document.getElementById("modelo").value = "";
      document.getElementById("serie").value = "";
      document.getElementById("tipo").value = "";
    })
    .catch(async (error) => {
      const errorText = await error.response?.text?.();
      alert("❌ Error: " + error.message + "\n" + (errorText || ""));
    });
}