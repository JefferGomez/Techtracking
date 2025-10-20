function agregarNota() {
  const nota = document.getElementById('nuevaNota').value.trim(); 
  // Obtiene el texto escrito en el campo de notas, y quita espacios al principio y al final.

  const historial = document.getElementById('historialServicio'); 
  // Busca el contenedor donde se muestran todas las notas anteriores.

  if (nota !== '') {
    // Si el campo no está vacío (es decir, el usuario escribió algo) entonces continúa...

    const fecha = new Date().toLocaleString(); 
    // Crea la fecha y hora actual en formato legible (por ejemplo, "22/06/2025 18:35").

    const li = document.createElement('li'); 
    // Crea un nuevo elemento <li> (una línea de lista).

    li.innerHTML = `<strong>${fecha}</strong> - ${nota}`; 
    // Inserta dentro del <li> la fecha en negrita, seguida de la nota escrita.

    historial.appendChild(li); 
    // Añade esta nueva línea al historial de notas.

    document.getElementById('nuevaNota').value = ''; 
    // Limpia el campo de texto después de agregar la nota.
  }
}
function agregarTarea() {
  const tarea = document.getElementById('nuevaTarea').value.trim(); 
  // Obtiene el texto de la nueva tarea que se quiere agregar.

  const lista = document.getElementById('listaTareas'); 
  // Busca la lista donde se agregan las tareas pendientes.

  if (tarea !== '') {
    // Solo continúa si se escribió algo en el campo.

    const li = document.createElement('li'); 
    // Crea una nueva línea de lista (<li>).

    li.textContent = tarea; 
    // Pone el texto de la tarea dentro del <li>.

    lista.appendChild(li); 
    // Añade la nueva tarea a la lista de tareas existentes.

    document.getElementById('nuevaTarea').value = ''; 
    // Limpia el campo de texto después de añadir la tarea.
  }
}
function descargarOrden() {
  alert('Descargando la orden en PDF... (simulado)'); 
  // Muestra un mensaje simulando que se está descargando un archivo PDF.
}
