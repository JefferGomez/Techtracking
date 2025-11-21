/* ============================================================================
   TECHTRACKING - CALENDARIO DE VISITAS
   Archivo JavaScript organizado, optimizado y ordenado
   ============================================================================ */

/* ------------------------------
   REFERENCIAS DEL DOM
--------------------------------*/
const calendarBody       = document.getElementById("calendarBody");
const currentMonthLabel  = document.getElementById("currentMonth");
const btnPrev            = document.getElementById("btnPrev");
const btnNext            = document.getElementById("btnNext");
const btnToday           = document.getElementById("btnToday");
const btnCreate          = document.getElementById("btnCreate");
const modal              = document.getElementById("visitModal");
const closeModal         = document.getElementById("closeModal");
const visitForm          = document.getElementById("visitForm");
const equiposSelect      = document.getElementById("equipos");

// Modal detalles
const detailModal        = document.getElementById("visitDetailModal");
const closeDetailModal   = document.getElementById("closeDetailModal");

// Modal de opciones
let visitaActualId       = null;


/* ------------------------------
   VARIABLES GLOBALES
--------------------------------*/
let visitasOriginales = [];
let visitas = [];
let filtroTecnico = "";
let filtroEstado = "";
let filtroTipo = "";
let currentDate = new Date();


/* ============================================================================
   1. RENDERIZAR CALENDARIO
============================================================================ */
function renderCalendar() {
    calendarBody.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const meses = [
        "Enero","Febrero","Marzo","Abril","Mayo","Junio",
        "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
    ];

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = (firstDay === 0 ? 6 : firstDay - 1);

    currentMonthLabel.textContent = `${meses[month]} ${year}`;

    // Celdas vacías al inicio
    for (let i = 0; i < offset; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.classList.add("day");
        calendarBody.appendChild(emptyCell);
    }

    // Días con visitas
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement("div");
        cell.classList.add("day");

        const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

        const num = document.createElement("div");
        num.classList.add("date-number");
        num.innerText = day;
        cell.appendChild(num);

        const visitasDelDia = visitas.filter(v => v.fecha === dateStr);

        visitasDelDia.forEach(v => {
            const card = crearTarjetaVisita(v);
            cell.appendChild(card);
        });

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


/* ============================================================================
   2. CREAR TARJETA DE VISITA
============================================================================ */
function crearTarjetaVisita(visita) {
    const card = document.createElement("div");
    card.classList.add("visit-card");

    if (visita.tipoServicio === "PREVENTIVO") card.classList.add("visit-preventivo");
    if (visita.tipoServicio === "CORRECTIVO") card.classList.add("visit-correctivo");
    if (visita.estado === "CANCELADA") card.classList.add("visit-cancelada");
    if (visita.estado === "INICIADA") card.classList.add("visit-iniciada");
    if (visita.estado === "FINALIZADA") card.classList.add("visit-finalizada");
    

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

    card.onclick = (e) => {
        if (!e.target.classList.contains("btn-delete-visit")) {
            mostrarDetallesVisita(visita);
        }
    };

    return card;
}


/* ============================================================================
   3. DETALLES DE VISITA
============================================================================ */
function mostrarDetallesVisita(visita) {
    const equiposStr = visita.equipos.map(eq =>
        `<li>${eq.marca} ${eq.modelo} (ID: ${eq.id})</li>`
    ).join("");

    document.getElementById("detailContent").innerHTML = `
        <h3>Detalles de la Visita</h3>
        <div style="margin-top: 20px;">
        <p><strong>📅 Fecha:</strong> ${visita.fecha}</p>
        <p><strong>🏷 Tipo:</strong> ${visita.tipoServicio}</p>
        <hr>

        <h4>Cliente</h4>
        <p>👤 ${visita.cliente.nombre}</p>
        <p>📍 ${visita.cliente.direccion}</p>
        <p>ID: ${visita.cliente.id}</p>
        <hr>

        <h4>Técnico</h4>
        <p>🔧 ${visita.tecnico.usuario.nombre}</p>
        <p>ID: ${visita.tecnico.id}</p>
        <hr>

        <h4>Equipos</h4>
        <ul>${equiposStr}</ul>
        </div>
    `;

    detailModal.classList.remove("hidden");
}

function mostrarTodasVisitas(fecha, visitas) {
    const visitasStr = visitas.map(v => `
        <div style="padding:10px; border:1px solid #ddd; margin:10px; border-radius:6px;">
            <strong>${v.cliente.nombre}</strong><br>
            📍 ${v.cliente.direccion}<br>
            🔧 ${v.tecnico.usuario.nombre}<br>
            🏷 ${v.tipoServicio}
        </div>
    `).join("");

    document.getElementById("detailContent").innerHTML = `
        <h3>Visitas del ${fecha}</h3>
        <div style="max-height:400px; overflow-y:auto;">${visitasStr}</div>
    `;

    detailModal.classList.remove("hidden");
}


/* ============================================================================
   4. CRUD: CREAR / ELIMINAR / ACTUALIZAR
============================================================================ */

// Crear visita
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
    .then(res => res.json())
    .then(data => {
        visitas.push(data);
        renderCalendar();
        modal.classList.add("hidden");
        visitForm.reset();
    });
});

// Modal opciones
function abrirModalOpciones(id) {
    visitaActualId = id;
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
    .then(() => {
        alert("Visita cancelada");
        cerrarModalOpciones();
        location.reload();
    });
}

// Reprogramar
function mostrarReprogramar() {
    document.getElementById("seccionReprogramar").style.display = "block";
}

function enviarReprogramacion() {
    const nuevaFecha = document.getElementById("nuevaFecha").value;

    fetch(`http://localhost:8080/admin/actualizarVisita/${visitaActualId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fecha: nuevaFecha, estado: "REPROGRAMADA" })
    })
    .then(() => {
        alert("Visita reprogramada");
        cerrarModalOpciones();
        location.reload();
    });
}


/* ============================================================================
   5. FILTROS
============================================================================ */
const inputFiltroTecnico = document.getElementById("filtroTecnico");
const selectFiltroEstado = document.getElementById("filtroEstado");
const selectFiltroTipo   = document.getElementById("filtroTipo");
// Aplicar filtros en tiempo real
inputFiltroTecnico.addEventListener("input", aplicarFiltros);
selectFiltroEstado.addEventListener("change", aplicarFiltros);
selectFiltroTipo.addEventListener("change", aplicarFiltros);



function aplicarFiltros() {
    filtroTecnico = inputFiltroTecnico.value.toLowerCase();
    filtroEstado = selectFiltroEstado.value;
    filtroTipo   = selectFiltroTipo.value;

    let filtradas = visitasOriginales;

    if (filtroTecnico.trim() !== "") {
        filtradas = filtradas.filter(v =>
            v.tecnico.usuario.nombre.toLowerCase().includes(filtroTecnico) ||
            String(v.tecnico.id).includes(filtroTecnico)
        );
    }

    if (filtroEstado !== "") {
        filtradas = filtradas.filter(v => v.estado === filtroEstado);
    }

    if (filtroTipo !== "") {
        filtradas = filtradas.filter(v => v.tipoServicio === filtroTipo);
    }

    visitas = filtradas;
    renderCalendar();
}

function limpiarFiltros() {
    filtroTecnico = filtroEstado = filtroTipo = "";

    inputFiltroTecnico.value = "";
    selectFiltroEstado.value = "";
    selectFiltroTipo.value = "";

    aplicarFiltros();
}


/* ============================================================================
   6. CARGA DE DATOS DESDE API
============================================================================ */
async function cargarVisitas() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const inicio = `${year}-${String(month+1).padStart(2,"0")}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const fin = `${year}-${String(month+1).padStart(2,"0")}-${lastDay}`;

    const res = await fetch(`http://localhost:8080/admin/mostrarVisitas?inicio=${inicio}&fin=${fin}`);
    const data = await res.json();

    console.log(data)
    visitasOriginales = data;
    aplicarFiltros();
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
    equiposSelect.innerHTML = "";

    if (!clienteId) {
        equiposSelect.innerHTML = `<option>Seleccione un cliente</option>`;
        return;
    }

    const res = await fetch(`http://localhost:8080/admin/equipoCliente/${clienteId}`);
    const equipos = await res.json();

    if (equipos.length === 0) {
        equiposSelect.innerHTML = `<option>Sin equipos</option>`;
        return;
    }

    equipos.forEach(eq => {
        const option = document.createElement("option");
        option.value = eq.id;
        option.textContent = `${eq.id} - ${eq.marca} - ${eq.modelo}`;
        equiposSelect.appendChild(option);
    });
}


/* ============================================================================
   7. EVENTOS GENERALES
============================================================================ */

// Navegación calendario
btnPrev.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    cargarVisitas();
});

btnNext.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    cargarVisitas();
});

// Abrir / cerrar modal crear
btnCreate.addEventListener("click", () => modal.classList.remove("hidden"));
closeModal.addEventListener("click", () => modal.classList.add("hidden"));

modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.add("hidden");
});

// Cerrar modal detalles
closeDetailModal.addEventListener("click", () => detailModal.classList.add("hidden"));
detailModal.addEventListener("click", e => {
    if (e.target === detailModal) detailModal.classList.add("hidden");
});

// Cargar equipos según cliente
document.getElementById("cliente").addEventListener("change", (e) =>
    cargarEquiposPorCliente(e.target.value)
);


/* ============================================================================
   8. INICIALIZACIÓN
============================================================================ */
document.addEventListener("DOMContentLoaded", () => {
    renderCalendar();
    cargarVisitas();
    cargarClientes();
    cargarTecnicos();
    modal.classList.add("hidden");
    detailModal.classList.add("hidden");
});

// ==========================
//   MANEJO DE MENÚS DE FILTRO
// ==========================

// Seleccionamos todos los grupos de filtros
const filterGroups = document.querySelectorAll(".filter-group");

// Abrir/cerrar al hacer clic
filterGroups.forEach(group => {
    const btn = group.querySelector(".filter-btn");

    btn.addEventListener("click", (e) => {
        e.stopPropagation(); // evita que cierre inmediatamente

        // Cerrar todos los demás
        filterGroups.forEach(g => {
            if (g !== group) g.classList.remove("open");
        });

        // Alternar el menú actual
        group.classList.toggle("open");
    });
});

// Cerrar al hacer clic afuera
document.addEventListener("click", () => {
    filterGroups.forEach(g => g.classList.remove("open"));
});

// Evitar que clic dentro del menú lo cierre
filterGroups.forEach(group => {
    const menu = group.querySelector(".filter-menu");
    menu.addEventListener("click", e => e.stopPropagation());
});

// ==========================
//   REDIRECCIÓN DEL SIDEBAR
// ==========================
document.querySelectorAll(".sidebar-item").forEach(item => {
    item.addEventListener("click", () => {
        const url = item.dataset.page;
        if (url) {
            window.location.href = url;
        }
    });
});



