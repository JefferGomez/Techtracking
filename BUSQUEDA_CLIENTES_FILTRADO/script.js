// Espera a que todo el contenido de la página esté cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {

  const searchInput = document.querySelector('.barra input'); // Selecciona el campo de búsqueda
  const tableBody = document.querySelector('tbody'); // Selecciona el cuerpo de la tabla
  const rows = Array.from(tableBody.querySelectorAll('tr')); // Obtiene todas las filas como una lista (array)

  const paginacion = document.querySelector('.paginacion'); // Selecciona la sección de paginación
  const prevBtn = paginacion.querySelector('button:first-child'); // Botón de "Anterior"
  const nextBtn = paginacion.querySelector('button:last-child'); // Botón de "Siguiente"
  const paginaSpan = paginacion.querySelector('.pagina-activa'); // Muestra el número de página actual

  let paginaActual = 1; // Página actual que se está mostrando
  const filasPorPagina = 5; // Cantidad de filas que se muestran por página

  // Función que muestra solo las filas correspondientes a la página actual
  function renderTabla(filtradas = rows) {
    const inicio = (paginaActual - 1) * filasPorPagina; // Cálculo de la primera fila que se va a mostrar
    const fin = inicio + filasPorPagina; // Cálculo de la última fila que se va a mostrar
    tableBody.innerHTML = ''; // Borra lo que había antes en la tabla
    filtradas.slice(inicio, fin).forEach(row => tableBody.appendChild(row)); // Añade solo las filas que van en la página actual
  }

  // Función que filtra por texto lo que se escribe en la barra de búsqueda
  function buscar() {
    const valor = searchInput.value.toLowerCase(); // Convierte el texto a minúsculas para una búsqueda sin distinguir mayúsculas
    const filtradas = rows.filter(row => row.textContent.toLowerCase().includes(valor)); // Filtra las filas que contienen ese texto
    paginaActual = 1; // Reinicia la paginación a la primera página
    renderTabla(filtradas); // Muestra los resultados filtrados
  }

  // Función que cambia de página (adelante o atrás)
  function cambiarPagina(delta) {
    const valor = searchInput.value.toLowerCase(); // Toma el texto de búsqueda actual
    const filtradas = rows.filter(row => row.textContent.toLowerCase().includes(valor)); // Aplica filtro de texto
    const totalPaginas = Math.ceil(filtradas.length / filasPorPagina); // Calcula cuántas páginas hay
    paginaActual += delta; // Suma o resta 1 a la página actual
    if (paginaActual < 1) paginaActual = 1; // No permite ir antes de la página 1
    if (paginaActual > totalPaginas) paginaActual = totalPaginas; // No permite ir más allá de la última página
    paginaSpan.textContent = paginaActual; // Actualiza el número que se muestra como página actual
    renderTabla(filtradas); // Muestra la tabla actualizada
  }

  // Escucha cuando el usuario escribe en la barra de búsqueda
  searchInput.addEventListener('input', buscar);

  // Escucha cuando el usuario hace clic en "Anterior"
  prevBtn.addEventListener('click', () => cambiarPagina(-1));

  // Escucha cuando el usuario hace clic en "Siguiente"
  nextBtn.addEventListener('click', () => cambiarPagina(1));

  renderTabla(); // Muestra por primera vez la tabla completa

}); // Fin del bloque que espera al DOM cargado

// -------------------------
// FILTROS POR ESTADO Y SERVICIO
// -------------------------

const filtroEstado = document.getElementById('filtroEstado'); // Obtiene el filtro de estado
const filtroServicio = document.getElementById('filtroServicio'); // Obtiene el filtro de tipo de servicio

// Función que aplica todos los filtros (texto, estado y servicio)
function aplicarFiltros() {
  const texto = searchInput.value.toLowerCase(); // Obtiene el texto de búsqueda actual
  const estado = filtroEstado.value; // Obtiene el estado seleccionado (ej: activo)
  const servicio = filtroServicio.value; // Obtiene el tipo de servicio seleccionado

  // Filtra todas las filas con base en los 3 criterios
  const filtradas = rows.filter(row => {
    const rowText = row.textContent.toLowerCase(); // Todo el texto de la fila en minúscula
    const rowEstado = row.querySelector('.estado')?.classList[1] || ''; // Estado del cliente (activo, pendiente, etc.)
    const rowServicio = row.cells[4].textContent.toLowerCase(); // Tipo de servicio (columna 5)

    const coincideTexto = rowText.includes(texto); // Coincide con la búsqueda escrita
    const coincideEstado = !estado || rowEstado === estado; // Coincide con el filtro de estado o no hay filtro
    const coincideServicio = !servicio || rowServicio === servicio; // Coincide con tipo de servicio o no hay filtro

    return coincideTexto && coincideEstado && coincideServicio; // Devuelve solo las filas que cumplen todas las condiciones
  });

  paginaActual = 1; // Vuelve a la primera página
  renderTabla(filtradas); // Muestra las filas filtradas
}

// Escucha cuando el usuario cambia el filtro de estado
filtroEstado.addEventListener('change', aplicarFiltros);

// Escucha cuando el usuario cambia el filtro de servicio
filtroServicio.addEventListener('change', aplicarFiltros);

