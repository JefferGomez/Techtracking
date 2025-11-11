const calendarBody = document.getElementById("calendarBody");
const currentMonthLabel = document.getElementById("currentMonth");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnToday = document.getElementById("btnToday");
const btnCreate = document.getElementById("btnCreate");
const modal = document.getElementById("visitModal");
const closeModal = document.getElementById("closeModal");
const visitForm = document.getElementById("visitForm");
const equiposSelect = document.getElementById("equipos");

// Modal de detalles de visita
const detailModal = document.getElementById("visitDetailModal");
const closeDetailModal = document.getElementById("closeDetailModal");

document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".sidebar-item");
    const iframe = document.getElementById("contenido");

    items.forEach(item => {
        item.addEventListener("click", () => {
            items.forEach(i => i.classList.remove("active"));
            item.classList.add("active");

            iframe.src = item.dataset.target;
        });
    });
});

let visitas = [];
let currentDate = new Date();

// Renderizar calendario con tarjetas mejoradas
function renderCalendar() {
  calendarBody.innerHTML = "";
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  currentMonthLabel.textContent = `${meses[month]} ${year}`;

  const offset = (firstDay === 0 ? 6 : firstDay - 1);

  for (let i = 0; i < offset; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("day");
    calendarBody.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    cell.classList.add("day");
    const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

    const num = document.createElement("div");
    num.classList.add("date-number");
    num.innerText = day;
    cell.appendChild(num);

    // Filtrar y renderizar visitas del día
    const visitasDelDia = visitas.filter(v => v.fecha === dateStr);

    visitasDelDia.forEach(v => {
      const card = crearTarjetaVisita(v);
      cell.appendChild(card);
    });

    // Mostrar "ver más" si hay más de 3 visitas
    if (visitasDelDia.length > 3) {
      const moreBtn = document.createElement("div");
      moreBtn.classList.add("more-events");
      moreBtn.innerText = `+ ${visitasDelDia.length - 3} más`;
      moreBtn.onclick = () => mostrarTodasVisitas(dateStr, visitasDelDia);
      cell.appendChild(moreBtn);
    }

    calendarBody.appendChild(cell);
  }
}

// Crear tarjeta de visita mejorada
function crearTarjetaVisita(visita) {
  const card = document.createElement("div");
  card.classList.add("visit-card");

  // Color según tipo de servicio
  if (visita.tipoServicio === "PREVENTIVO") {
    card.classList.add("visit-preventivo");
  } else if (visita.tipoServicio === "CORRECTIVO") {
    card.classList.add("visit-correctivo");
  }


  if(visita.estado === "CANCELADA"){
    card.classList.add("visit-cancelada")
  }


  card.innerHTML = `
    <div class="visit-card-header">
      <span class="visit-type">${visita.tipoServicio}</span>
      <button class="btn-delete-visit" onclick="abrirModalOpciones(${visita.id})">ⓘ</button>
    </div>
    <div class="visit-card-body">
      <div class="visit-info">
        <span class="icon">👤</span>
        <span class="text">${visita.cliente.nombre}</span>
      </div>
      <div class="visit-info">
        <span class="icon">📍</span>
        <span class="text">${visita.cliente.direccion}</span>
      </div>
      <div class="visit-info">
        <span class="icon">🔧</span>
        <span class="text">${visita.tecnico.usuario.nombre}</span>
      </div>
    </div>
  `;

  // Click en la tarjeta para ver detalles
  card.onclick = (e) => {
    if (!e.target.classList.contains('btn-delete-visit')) {
      mostrarDetallesVisita(visita);
    }
  };

  return card;
}

// Función para eliminar visita
function eliminarVisita(visitaId, event) {
  event.stopPropagation(); // Evitar que se abra el modal de detalles

  if (!confirm("¿Estás seguro de eliminar esta visita?")) {
    return;
  }

  fetch(`http://localhost:8080/admin/eliminarVisita/${visitaId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(res => {
    console.log("Respuesta del servidor:", res.status);

    // Si el servidor responde 200 o 204 (No Content), es exitoso
    if (res.ok || res.status === 204) {
      console.log("✅ Visita eliminada correctamente");

      // Actualizar el array local y re-renderizar
      visitas = visitas.filter(v => v.id !== visitaId);
      renderCalendar();

      alert("Visita eliminada exitosamente");
      return;
    }

    // Si hay error, intentar leer el mensaje
    return res.text().then(text => {
      throw new Error(text || `Error ${res.status}: No se pudo eliminar`);
    });
  })
  .catch(err => {
    console.error("❌ Error completo:", err);
    alert(`No se pudo eliminar la visita: ${err.message}`);
  });
}

// Mostrar detalles completos de la visita
function mostrarDetallesVisita(visita) {
  const equiposStr = visita.equipos.map(eq =>
    `<li>${eq.marca} ${eq.modelo} (ID: ${eq.id})</li>`
  ).join("");

  document.getElementById("detailContent").innerHTML = `
    <h3>Detalles de la Visita</h3>
    <div style="margin-top: 20px;">
      <p><strong>📅 Fecha:</strong> ${visita.fecha}</p>
      <p><strong>🏷️ Tipo de Servicio:</strong> ${visita.tipoServicio}</p>
      <hr style="margin: 15px 0; border: none; border-top: 1px solid #eee;">

      <h4>Cliente</h4>
      <p><strong>👤 Nombre:</strong> ${visita.cliente.nombre}</p>
      <p><strong>📍 Dirección:</strong> ${visita.cliente.direccion}</p>
      <p><strong>🆔 ID:</strong> ${visita.cliente.id}</p>

      <hr style="margin: 15px 0; border: none; border-top: 1px solid #eee;">

      <h4>Técnico Asignado</h4>
      <p><strong>🔧 Nombre:</strong> ${visita.tecnico.usuario.nombre}</p>
      <p><strong>🆔 ID:</strong> ${visita.tecnico.id}</p>

      <hr style="margin: 15px 0; border: none; border-top: 1px solid #eee;">

      <h4>Equipos</h4>
      <ul style="margin-left: 20px;">
        ${equiposStr}
      </ul>
    </div>
  `;

  detailModal.classList.remove("hidden");
}

// Mostrar todas las visitas de un día
function mostrarTodasVisitas(fecha, visitas) {
  const visitasStr = visitas.map(v => `
    <div style="padding: 10px; border: 1px solid #ddd; margin: 10px 0; border-radius: 6px;">
      <strong>${v.cliente.nombre}</strong><br>
      📍 ${v.cliente.direccion}<br>
      🔧 ${v.tecnico.usuario.nombre}<br>
      🏷️ ${v.tipoServicio}
    </div>
  `).join("");

  document.getElementById("detailContent").innerHTML = `
    <h3>Visitas del ${fecha}</h3>
    <div style="margin-top: 20px; max-height: 400px; overflow-y: auto;">
      ${visitasStr}
    </div>
  `;

  detailModal.classList.remove("hidden");
}

// Navegación
btnPrev.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
  cargarVisitas();
});

btnNext.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
  cargarVisitas();
});

btnToday.addEventListener("click", () => {
  currentDate = new Date();
  renderCalendar();
  cargarVisitas();
});

// Modal crear visita
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

btnCreate.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

// Modal detalles
closeDetailModal.addEventListener("click", () => {
  detailModal.classList.add("hidden");
});

// Cerrar modales al hacer click fuera
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

detailModal.addEventListener("click", (e) => {
  if (e.target === detailModal) {
    detailModal.classList.add("hidden");
  }
});

// Guardar visita
visitForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const equiposSeleccionados = Array.from(equiposSelect.selectedOptions).map(opt => ({
    id: parseInt(opt.value)
  }));

  const nuevaVisita = {
    fecha: document.getElementById("date").value,
    cliente: { id: parseInt(document.getElementById("cliente").value) },
    tecnico: { id: parseInt(document.getElementById("tecnico").value) },
    tipoServicio: document.getElementById("servicio").value,
    equipos: equiposSeleccionados
  };

  fetch("http://localhost:8080/admin/crearVisitas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevaVisita)
  })
  .then(res => {
    if (!res.ok) throw new Error("Error en la petición");
    return res.json();
  })
  .then(data => {
    console.log("✅ Visita guardada en BD:", data);
    visitas.push(data);
    renderCalendar();
    modal.classList.add("hidden");
    visitForm.reset();
  })
  .catch(err => {
    console.error("❌ Error:", err);
    alert("No se pudo guardar la visita");
  });
});

// Cargar visitas desde la API
function cargarVisitas() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const inicio = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month + 1, 0).getDate();
  const fin = `${year}-${String(month + 1).padStart(2, "0")}-${lastDay}`;

  fetch(`http://localhost:8080/admin/mostrarVisitas?inicio=${inicio}&fin=${fin}`)
    .then(res => res.json())
    .then(data => {
      visitas = data;
      renderCalendar();
    })
    .catch(err => console.error("Error cargando visitas:", err));
}

async function cargarClientes() {
  const res = await fetch("http://localhost:8080/admin/clientes");
  const clientes = await res.json();
  const select = document.getElementById("cliente");

  clientes.forEach(c => {
    const option = document.createElement("option");
    option.value = c.id;
    option.textContent = `${c.id} - ${c.nombre}`;
    select.appendChild(option);
  });
}

async function cargarTecnicos() {
  const res = await fetch("http://localhost:8080/admin/tecnicos");
  const tecnicos = await res.json();
  const select = document.getElementById("tecnico");

  tecnicos.forEach(t => {
    const option = document.createElement("option");
    option.value = t.id;
    option.textContent = `${t.id} - ${t.usuario.nombre}`;
    select.appendChild(option);
  });
}

async function cargarEquiposPorCliente(clienteId) {
  const equiposSelect = document.getElementById("equipos");
  equiposSelect.innerHTML = "";

  if (!clienteId) {
    equiposSelect.innerHTML = `<option value="">Seleccione un cliente primero</option>`;
    return;
  }

  try {
    const res = await fetch(`http://localhost:8080/admin/equipoCliente/${clienteId}`);
    if (!res.ok) throw new Error("Error cargando equipos");

    const equipos = await res.json();

    if (equipos.length === 0) {
      equiposSelect.innerHTML = `<option value="">Este cliente no tiene equipos</option>`;
    } else {
      equipos.forEach(eq => {
        const option = document.createElement("option");
        option.value = eq.id;
        option.textContent = `${eq.id} - ${eq.marca} - ${eq.modelo}`;
        equiposSelect.appendChild(option);
      });
    }
  } catch (err) {
    console.error("❌ Error cargando equipos:", err);
    equiposSelect.innerHTML = `<option value="">Error al cargar equipos</option>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".sidebar-item");
    const currentPath = window.location.pathname;

    items.forEach(item => {
        const page = item.getAttribute("data-page");

        if (currentPath === page) {
            item.classList.add("active");
        }

        item.addEventListener("click", () => {
            window.location.href = page;
        });
    });
});

// Inicialización
modal.classList.add("hidden");
detailModal.classList.add("hidden");
cargarVisitas();
cargarClientes();
document.getElementById("cliente").addEventListener("change", (e) => {
  const clienteId = e.target.value;
  cargarEquiposPorCliente(clienteId);
});
cargarTecnicos();


let visitaActualId = null;

function abrirModalOpciones(visitaId) {
  visitaActualId = visitaId;
  document.getElementById("modalOpciones").style.display = "flex";
  document.getElementById("seccionReprogramar").style.display = "none";
}

function cerrarModalOpciones() {
  document.getElementById("modalOpciones").style.display = "none";
  visitaActualId = null;
}

// Cancelar visita
function cancelarDesdeModal() {
  fetch(`http://localhost:8080/admin/actualizarVisita/${visitaActualId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado: "CANCELADA" })
  })
  .then(res => res.json())
  .then(data => {
    alert("Visita cancelada");
    cerrarModalOpciones();
    location.reload(); // o actualizar tarjeta dinámicamente
  });
}

// Mostrar la sección para reprogramar
function mostrarReprogramar() {
  document.getElementById("seccionReprogramar").style.display = "block";
}

// Enviar nueva fecha
function enviarReprogramacion() {
  const nuevaFecha = document.getElementById("nuevaFecha").value;
  if (!nuevaFecha) return alert("Selecciona una fecha válida");

  fetch(`http://localhost:8080/admin/actualizarVisita/${visitaActualId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fecha: nuevaFecha, estado: "REPROGRAMADA" })
  })
  .then(res => res.json())
  .then(data => {
    alert("Visita reprogramada");
    cerrarModalOpciones();
    location.reload(); // o actualizar tarjeta dinámicamente
  });
}
