document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.barra input');
  const tableBody = document.getElementById('clientesBody');
  const paginacion = document.querySelector('.paginacion');
  const prevBtn = paginacion.querySelector('button:first-child');
  const nextBtn = paginacion.querySelector('button:last-child');
  const paginaSpan = paginacion.querySelector('.pagina-activa');

  let paginaActual = 1;
  const filasPorPagina = 5;
  let datos = [];

  function cargarClientes(clientes) {
    const tbody = document.getElementById("clientesBody");
    tbody.innerHTML = "";

    clientes.forEach(cliente => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${cliente.id}</td>
        <td>${cliente.nombre}</td>
        <td>${cliente.direccion}</td>
        <td>${cliente.telefono}</td>
        <td>${cliente.correo}</td>
        <td><button onclick="verDetalles(${cliente.id})">Ver Detalles</button></td>
      `;
      tbody.appendChild(fila);
    });
  }


  function verDetalles(clienteId) {
    sessionStorage.setItem("clienteId", clienteId);
    window.location.href = "/admin/vistaequipo.html";
  }

  function construirFila(cliente) {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${cliente.id}</td>
      <td>${cliente.nombre}</td>
      <td>${cliente.direccion}</td>
      <td>${cliente.telefono}</td>
      <td>${cliente.correo}</td>
      <td><button onclick="verDetalles(${cliente.id})">Ver Detalles</button></td>
    `;
    return fila;
  }



  function renderTabla(filtradas = datos) {
    const inicio = (paginaActual - 1) * filasPorPagina;
    const fin = inicio + filasPorPagina;
    tableBody.innerHTML = '';

    filtradas.slice(inicio, fin).forEach(dato => {
      const fila = construirFila(dato);
      tableBody.appendChild(fila);
    });

    paginaSpan.textContent = paginaActual;
  }

  function buscar() {
    const valor = searchInput.value.toLowerCase();
    const filtradas = datos.filter(d =>
      Object.values(d).some(val =>
        String(val).toLowerCase().includes(valor)
      )
    );
    paginaActual = 1;
    renderTabla(filtradas);
  }

  function cambiarPagina(delta) {
    const valor = searchInput.value.toLowerCase();
    const filtradas = datos.filter(d =>
      Object.values(d).some(val =>
        String(val).toLowerCase().includes(valor)
      )
    );
    const totalPaginas = Math.ceil(filtradas.length / filasPorPagina);
    paginaActual += delta;
    if (paginaActual < 1) paginaActual = 1;
    if (paginaActual > totalPaginas) paginaActual = totalPaginas;
    renderTabla(filtradas);
  }

  searchInput.addEventListener('input', buscar);
  prevBtn.addEventListener('click', () => cambiarPagina(-1));
  nextBtn.addEventListener('click', () => cambiarPagina(1));

  fetch('http://localhost:8080/admin/mostrarClientes')
    .then(response => response.json())
    .then(data => {
      datos = data;
      renderTabla();
    })
    .catch(error => console.error('Error al cargar los datos:', error));
});
