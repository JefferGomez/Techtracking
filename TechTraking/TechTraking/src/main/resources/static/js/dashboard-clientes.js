function cargarClientes() {
  fetch("/admin/clientes") // endpoint que devuelve lista de clientes
    .then(response => response.json())
    .then(clientes => {
      const tbody = document.getElementById("clientesBody");
      tbody.innerHTML = "";

      clientes.forEach(cliente => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${cliente.id}</td>
          <td>${cliente.nombre}</td>
          <td>${cliente.direccion}</td>
          <td>${cliente.telefono}</td>
          <td>${cliente.correo}</td>
          <td>
            <button onclick="verDetalle(${cliente.id})">Ver detalle</button>
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
});

// Función para redirigir a vistaequipo con el clienteId guardado
function verDetalle(clienteId) {
  sessionStorage.setItem("clienteId", clienteId);
  window.location.href = "/admin/vistaequipo";
}

// Cuando cargue la página de clientes, ejecutar carga
document.addEventListener("DOMContentLoaded", cargarClientes);
