document.addEventListener('DOMContentLoaded', () => {
  const clienteId = sessionStorage.getItem("clienteId");

  if (!clienteId) {
    alert("No se encontró cliente seleccionado.");
    return;
  }

  fetch(`/admin/vistaequipo/${clienteId}`)
    .then(response => {
      if (!response.ok) throw new Error("Error al obtener cliente");
      return response.json();
    })
    .then(cliente => {
      // Cliente info
      document.getElementById('NIT').textContent = cliente.id;
      document.getElementById('Empresa').textContent = cliente.nombre;
      document.getElementById('direccionCliente').textContent = cliente.direccion;
      document.getElementById('Telefono').textContent = cliente.telefono;
      document.getElementById('correoCliente').textContent = cliente.correo;

      // Equipos en tabla
      const tabla = document.getElementById('tablaEquipos');
      tabla.innerHTML = '';

      (cliente.equipos || []).forEach(equipo => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${equipo.id}</td>
          <td>${equipo.marca}</td>
          <td>${equipo.modelo}</td>
          <td>${equipo.serial}</td>
          <td>${equipo.tipo}</td>
        `;
        tabla.appendChild(fila);
      });
    })
    .catch(error => {
      console.error('Error al cargar los datos:', error);
    });
});
