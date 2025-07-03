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

  fetch("/api/equipos", {
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
