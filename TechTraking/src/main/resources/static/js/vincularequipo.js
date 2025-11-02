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

  // Leer todos los datos del formulario
  const equipo = {
    marca: document.getElementById("nombreEquipo").value,
    modelo: document.getElementById("modelo").value,
    serial: parseInt(document.getElementById("idEquipo").value),
    tipo: document.getElementById("tipo").value,
    clienteId: parseInt(clienteId)
  };

  fetch("/admin/equipos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(equipo)
  })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(text || "Error al vincular equipo");
        });
      }
      return response.json();
    })
    .then(data => {
      alert("✅ Equipo vinculado exitosamente");
      // Limpiar campos
      document.getElementById("idEquipo").value = "";
      document.getElementById("nombreEquipo").value = "";
      document.getElementById("modelo").value = "";
      // document.getElementById("serie").value = ""; // si luego lo agregas
      document.getElementById("tipo").value = "";
    })
    .catch(error => {
      console.error(error);
      alert("❌ Error: " + error.message);
    });
}
