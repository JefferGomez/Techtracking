

function cargarClientes(filtro = "") {
  fetch("/admin/clientes") // endpoint que devuelve lista de clientes
    .then(response => response.json())
    .then(clientes => {
      const tbody = document.getElementById("clientesBody");
      tbody.innerHTML = "";

      // Si hay filtro, filtramos por nombre, id o correo
      const filtrados = clientes.filter(c =>
        c.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        c.id.toString().includes(filtro) ||
        c.correo.toLowerCase().includes(filtro.toLowerCase())
      );

      if (filtrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6">No se encontraron clientes</td></tr>`;
        return;
      }

      filtrados.forEach(cliente => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${cliente.id}</td>
          <td>${cliente.nombre}</td>
          <td>${cliente.direccion}</td>
          <td>${cliente.telefono}</td>
          <td>${cliente.correo}</td>
          <td>
            <button class="nuevo" onclick="verDetalle(${cliente.id})">Ver detalle</button>
          </td>
        `;

        tbody.appendChild(row);
      });
    })
    .catch(error => console.error("Error cargando clientes:", error));
}


document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".sidebar-item");
    const currentPath = window.location.pathname;
    const inputBuscar = document.getElementById("buscarCliente");


    items.forEach(item => {
        const page = item.getAttribute("data-page");

        // Marca activo si coincide con la URL
        if (currentPath === page) {
            item.classList.add("active");
        }

        // Al hacer click redirige
        item.addEventListener("click", () => {
            window.location.href = page;
        });
    });

    cargarClientes()
    
    inputBuscar.addEventListener("input", e => {
    const texto = e.target.value;
    cargarClientes(texto);

  });
});

// Función para redirigir a vistaequipo con el clienteId guardado
function verDetalle(clienteId) {
  sessionStorage.setItem("clienteId", clienteId);
  window.location.href = "/admin/vistaequipo";
}


