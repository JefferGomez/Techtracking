const calendarBody = document.getElementById("calendarBody");
const currentMonthLabel = document.getElementById("currentMonth");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnToday = document.getElementById("btnToday");
const btnCreate = document.getElementById("btnCreate");
const modal = document.getElementById("visitModal");
const closeModal = document.getElementById("closeModal");
const visitForm = document.getElementById("visitForm");

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
      if (v.date === dateStr) {
        const div = document.createElement("div");
        div.classList.add("visit");
        div.innerText = `${v.description} (${v.cliente} - ${v.tecnico})`;
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
});

btnNext.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

btnToday.addEventListener("click", () => {
  currentDate = new Date();
  renderCalendar();
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

  const nuevaVisita = {
    date: document.getElementById("date").value,
    description: document.getElementById("description").value,
    cliente: document.getElementById("cliente").value,
    tecnico: document.getElementById("tecnico").value
  };

  fetch("http://localhost:8080/tecnico/crearVisitas", {   // cambia la URL por la de tu backend
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
    visitas.push(nuevaVisita); // actualizar el arreglo local
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
  fetch("http://localhost:8080/tecnico/crearVisitas")   // cambia la URL por tu backend
    .then(res => res.json())
    .then(data => {
      visitas = data;
      renderCalendar();
    })
    .catch(err => console.error("Error cargando visitas:", err));
}

// Inicial
modal.classList.add("hidden");
cargarVisitas();
