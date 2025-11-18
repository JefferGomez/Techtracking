let clientesGlobal = [];  // lista completa de clientes cargados del backend
let paginaActual = 1;
const POR_PAGINA = 6;

// 🔹 Cargar clientes desde backend + aplicar filtro
function cargarClientes(filtro = "") {
  fetch("/admin/clientes")
    .then(response => response.json())
    .then(clientes => {

      // Guardamos la lista completa
      clientesGlobal = clientes;

      // Si hay filtro, aplicarlo
      if (filtro.trim() !== "") {
        clientesGlobal = clientes.filter(c =>
          c.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
          c.id.toString().includes(filtro) ||
          c.correo.toLowerCase().includes(filtro.toLowerCase())
        );
      }

      paginaActual = 1;
      renderPagina();
    })
    .catch(error => console.error("Error cargando clientes:", error));
}

// 🔹 Renderizar solo una página
function renderPagina() {
  const tbody = document.getElementById("clientesBody");
  tbody.innerHTML = "";

  const inicio = (paginaActual - 1) * POR_PAGINA;
  const fin = inicio + POR_PAGINA;

  const paginaClientes = clientesGlobal.slice(inicio, fin);

  if (paginaClientes.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">No se encontraron clientes</td></tr>`;
    return;
  }

  paginaClientes.forEach(cliente => {
    tbody.innerHTML += `
      <tr>
        <td>${cliente.id}</td>
        <td>${cliente.nombre}</td>
        <td>${cliente.direccion}</td>
        <td>${cliente.telefono}</td>
        <td>${cliente.correo}</td>
        <td><button class="nuevo" onclick="verDetalle(${cliente.id})">Ver detalle</button></td>
      </tr>
    `;
  });

  actualizarPaginacion();
}

// 🔹 Actualizar botones "Anterior" / "Siguiente"
function actualizarPaginacion() {
  const totalPaginas = Math.ceil(clientesGlobal.length / POR_PAGINA);

  document.getElementById("paginaActual").textContent = paginaActual;

  document.getElementById("btnAnterior").disabled = paginaActual === 1;
  document.getElementById("btnSiguiente").disabled = paginaActual === totalPaginas;
}

document.getElementById("btnAnterior").addEventListener("click", () => {
  if (paginaActual > 1) {
    paginaActual--;
    renderPagina();
  }
});

document.getElementById("btnSiguiente").addEventListener("click", () => {
  const totalPaginas = Math.ceil(clientesGlobal.length / POR_PAGINA);
  if (paginaActual < totalPaginas) {
    paginaActual++;
    renderPagina();
  }
});

// 🔹 Buscar clientes
document.addEventListener("DOMContentLoaded", () => {
  const inputBuscar = document.getElementById("buscarCliente");

  cargarClientes();

  inputBuscar.addEventListener("input", e => {
    cargarClientes(e.target.value);
  });
});

// 🔹 Redirigir para ver detalles
function verDetalle(clienteId) {
  sessionStorage.setItem("clienteId", clienteId);
  window.location.href = "/admin/vistaequipo";
}
