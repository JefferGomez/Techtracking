function buscarCliente() { // Función que se ejecuta al hacer clic en el botón "Buscar"
  const valor = document.getElementById('buscarCliente').value.toLowerCase(); 
  // Obtiene lo que el usuario escribió en el campo de búsqueda y lo convierte a minúsculas para comparar

  // Información ficticia de un cliente guardada en un objeto
  const cliente = {
    nombre: "Industrias Modernas S.A.", // Nombre del cliente
    id: "CL0101",                        // ID único del cliente
    direccion: "Av. Siempreviva 742, Springfield", // Dirección del cliente
    ciudad: "Springfield",              // Ciudad del cliente
    contacto: "contacto@industriasmodernas.com / +34 987 654 321", // Email y teléfono
    tipo: "Jurídico",                   // Tipo de cliente (natural o jurídico)
    avatar: "https://via.placeholder.com/100" // Imagen/avatar del cliente
  };

  // Comprueba si el texto ingresado por el usuario contiene "modernas" o "cl0101"
  if (valor.includes("modernas") || valor.includes("cl0101")) {
    // Si hay coincidencia, se llenan los campos del cliente en la página con la información del objeto

    document.getElementById('nombreCliente').textContent = cliente.nombre;
    document.getElementById('idCliente').textContent = cliente.id;
    document.getElementById('direccionCliente').textContent = cliente.direccion;
    document.getElementById('ciudadCliente').textContent = cliente.ciudad;
    document.getElementById('contactoCliente').textContent = cliente.contacto;
    document.getElementById('tipoCliente').textContent = cliente.tipo;

    // Muestra la imagen/avatar del cliente
    const avatar = document.getElementById('avatarCliente');
    avatar.src = cliente.avatar; // Le asigna la imagen
    avatar.style.display = "block"; // La hace visible
  } else {
    // Si no hay coincidencia, muestra un mensaje de alerta
    alert("Cliente no encontrado.");
  }
}
function vincularEquipo() {
  // Campos del equipo
  const camposEquipo = [
    'nombreEquipo', 'modelo', 'fecha', 'serie',
    'ubicacion', 'caracteristicas', 'estadoFisico',
    'voltaje', 'estadoEquipo'
  ];

  // Verifica que todos los campos del equipo estén llenos y recoge los datos
  let datosEquipo = {};
  for (const id of camposEquipo) {
    const input = document.getElementById(id);
    if (!input || input.value.trim() === '') {
      alert("Por favor completa todos los campos del equipo.");
      return;
    }
    datosEquipo[id] = input.value.trim();
  }

  // Verifica que el cliente esté seleccionado
  if (!document.getElementById('nombreCliente').textContent.trim()) {
    alert("Primero debes buscar y seleccionar un cliente.");
    return;
  }

  // Extraer datos del cliente desde el HTML
  const datosCliente = {
    nombre: document.getElementById('nombreCliente').textContent.trim(),
    id: document.getElementById('idCliente').textContent.trim(),
    direccion: document.getElementById('direccionCliente').textContent.trim(),
    ciudad: document.getElementById('ciudadCliente').textContent.trim(),
    contacto: document.getElementById('contactoCliente').textContent.trim(),
    tipo: document.getElementById('tipoCliente').textContent.trim()
  };

  // Crear el objeto JSON final con cliente y equipo
  const resultado = {
    cliente: datosCliente,
    equipo: datosEquipo,
    fechaVinculacion: new Date().toISOString()
  };

  // Convertir el objeto a JSON legible
  const jsonTexto = JSON.stringify(resultado, null, 2);

  // Mostrar en consola
  console.log(jsonTexto);

  // Descargar el archivo como .json
  const blob = new Blob([jsonTexto], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `vinculacion_${datosCliente.id}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  alert("¡Equipo vinculado exitosamente y guardado en JSON!");
}

// Detectar cuando el estado cambia y aplicar color al fondo
document.getElementById("estadoEquipo").addEventListener("change", function () {
  const estado = this.value;
  if (estado === "activo") {
    this.style.backgroundColor = "#d4edda";  // verde claro
    this.style.color = "#155724";
  } else if (estado === "inactivo") {
    this.style.backgroundColor = "#f8d7da";  // rojo claro
    this.style.color = "#721c24";
  } else if (estado === "pendiente") {
    this.style.backgroundColor = "#fff3cd";  // amarillo claro
    this.style.color = "#856404";
  } else {
    this.style.backgroundColor = "#f0f0f0";  // por defecto
    this.style.color = "#000";
  }
});
