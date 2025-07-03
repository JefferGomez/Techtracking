document.addEventListener('DOMContentLoaded', () => {
  const clienteId = sessionStorage.getItem("clienteId");

  if (!clienteId) {
    alert("No se encontró cliente seleccionado.");
    return;
  }

  fetch(`http://localhost:8080/api/vistaequipo/${clienteId}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('NIT').textContent = data.cliente.id;
      document.getElementById('Empresa').textContent = data.cliente.nombre;
      document.getElementById('direccionCliente').textContent = data.cliente.direccion;
      document.getElementById('Telefono').textContent = data.cliente.telefono;
      document.getElementById('correoCliente').textContent = data.cliente.correo;

      if (data.equipo) {
        document.getElementById('nombreEquipo').textContent = data.equipo.marca;
        document.getElementById('modelo').textContent = data.equipo.modelo;
        document.getElementById('serie').textContent = data.equipo.serie;
        document.getElementById('tipo').textContent = data.equipo.tipo;
      }
    })
    .catch(error => {
      console.error('Error al cargar los datos:', error);
    });
});
x|