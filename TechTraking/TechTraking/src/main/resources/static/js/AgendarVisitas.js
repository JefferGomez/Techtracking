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


document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".sidebar-item");
    const iframe = document.getElementById("contenido");

    items.forEach(item => {
        item.addEventListener("click", () => {
            items.forEach(i => i.classList.remove("active"));
            item.classList.add("active");

            iframe.src = item.dataset.target; // carga el endpoint en el iframe
        });
    });
});



// Aquí ya no usamos localStorage, sino que vamos a traer visitas desde la API
let visitas = [];
let currentDate = new Date();

// Renderizar calendario en español
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

  // Ajuste: domingo=0, lunes=1
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
    visitas.forEach(v => {
      if (v.fecha === dateStr) {
        const div = document.createElement("div");
        div.classList.add("visit");

        const equiposStr = v.equipos.map(eq => `${eq.id} - ${eq.marca}-${eq.modelo}`).join(", ");
        div.innerText = `Cliente(Id:${v.cliente.id} 
        Dir:${v.cliente.direccion} 
        Nombre:${v.cliente.nombre})  
        Tecnico(Id:${v.tecnico.id} 
        Nombre:${v.tecnico.usuario.nombre}
        Equipos:${equiposStr}`;
        cell.appendChild(div);
      }
    });

    calendarBody.appendChild(cell);
  }
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

// Modal
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

btnCreate.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

// Cerrar modal si se hace click fuera del contenido
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

// Guardar visita (POST a la API)
visitForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const equiposSeleccionados = Array.from(equiposSelect.selectedOptions).map(opt => ({
    id: parseInt(opt.value)}));

  const nuevaVisita = {
    fecha: document.getElementById("date").value,
    cliente: { id: parseInt(document.getElementById("cliente").value) },
    tecnico: { id: parseInt(document.getElementById("tecnico").value) }, 
    tipoServicio: document.getElementById("servicio").value,
    equipos:equiposSeleccionados
  };


  console.log("Visita a enviar:", nuevaVisita);



  fetch("http://localhost:8080/admin/crearVisitas", {   // cambia la URL por la de tu backend
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
    visitas.push(data); // actualizar el arreglo local
    renderCalendar();
    modal.classList.add("hidden");
    visitForm.reset();
  })
  .catch(err => {
    console.error("❌ Error:", err);
    alert("No se pudo guardar la visita");
  });
});


// 👉 Cargar visitas desde la API (GET)
function cargarVisitas() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Primer día del mes
  const inicio = `${year}-${String(month + 1).padStart(2, "0")}-01`;

  // Último día del mes (creamos fecha del día 0 del mes siguiente)
  const lastDay = new Date(year, month + 1, 0).getDate();
  const fin = `${year}-${String(month + 1).padStart(2, "0")}-${lastDay}`;

  fetch(`http://localhost:8080/admin/mostrarVisitas?inicio=${inicio}&fin=${fin}`)   // cambia la URL por tu backend

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
    option.value = c.id; // 👈 importante: aquí va el id
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
    option.value = t.id; // 👈 importante: aquí va el id
    option.textContent = `${t.id} - ${t.usuario.nombre}`;
    select.appendChild(option);
  });
}

async function cargarEquiposPorCliente(clienteId) {
  const equiposSelect = document.getElementById("equipos");
  equiposSelect.innerHTML = ""; // limpiar

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
        option.textContent = `${eq.id} - ${eq.marca}- ${eq.modelo}`; // ajusta según atributos
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



// Inicial
modal.classList.add("hidden");
cargarVisitas();
cargarClientes();
document.getElementById("cliente").addEventListener("change", (e) => {
  const clienteId = e.target.value;
  cargarEquiposPorCliente(clienteId);
});
cargarTecnicos();
// Inicial
modal.classList.add("hidden");
cargarVisitas();
