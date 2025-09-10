document.addEventListener('DOMContentLoaded', () => {
  const clienteId = sessionStorage.getItem("clienteId");

  if (!clienteId) {
    alert("No se encontró cliente seleccionado.");
    return;
  }

  fetch(`http://localhost:8080/api/vistaequipo/${clienteId}`)
    .then(response => response.json())
    .then(data => {
      // Cliente info
      document.getElementById('NIT').textContent = data.cliente.id;
      document.getElementById('Empresa').textContent = data.cliente.nombre;
      document.getElementById('direccionCliente').textContent = data.cliente.direccion;
      document.getElementById('Telefono').textContent = data.cliente.telefono;
      document.getElementById('correoCliente').textContent = data.cliente.correo;

      // Equipos en tabla
      const tabla = document.getElementById('tablaEquipos');
      tabla.innerHTML = ''; // limpiar por si acaso

      const equipos = data.cliente.equipos || [];
      equipos.forEach(equipo => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${equipo.id}</td>
          <td>${equipo.marca}</td>
          <td>${equipo.modelo}</td>
          <td>${equipo.serie}</td>
          <td>${equipo.tipo}</td>
        `;
        tabla.appendChild(fila);
      });
    })
    .catch(error => {
      console.error('Error al cargar los datos:', error);
    });
});
