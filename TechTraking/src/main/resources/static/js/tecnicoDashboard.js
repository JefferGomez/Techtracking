async function cargarVista(vista, tecnicoId) {
  const cont = document.getElementById("contenido");

  if (vista === "cronograma") {
    cont.innerHTML = `
      <h2>Mi Cronograma</h2>
      <div id="cronograma"></div>
    `;
    cargarCronograma();
  }

  if (vista === "chat") {
    try {
      const response = await fetch("/chat-fragment");
      const html = await response.text();
      cont.innerHTML = html;

      // Ejecutar los scripts que vienen en el HTML
      const scripts = cont.querySelectorAll("script");
      scripts.forEach(script => {
        const newScript = document.createElement("script");
        newScript.textContent = script.textContent;
        document.body.appendChild(newScript);
        document.body.removeChild(newScript);
      });
    } catch (error) {
      console.error("Error al cargar el chat:", error);
      cont.innerHTML = "<p>Error al cargar el chat</p>";
    }
  }

  const enlaces = document.querySelectorAll(".sidebar ul li a");
  enlaces.forEach(a => {
    if (a.getAttribute("onclick") && a.getAttribute("onclick").includes(vista)) {
      a.classList.add("activo");
    } else {
      a.classList.remove("activo");
    }
  });
}

async function cargarCronograma() {
  const res = await fetch(`/tecnico/visitasTecnico`);
  const visitas = await res.json();

  const cont = document.getElementById("cronograma");
  cont.innerHTML = "";
  
  Object.entries(visitas).forEach(([fecha, cantidad]) => {
        const div = document.createElement("div");
        div.classList.add("dia");
        div.innerHTML = `
            <h3>${fecha} — ${cantidad} visitas</h3>
            <button onclick="verVisitas('${fecha}')">Ver visitas</button>
        `;
        cont.appendChild(div);
    });
}

function verVisitas(fecha) {
  localStorage.setItem("fechaSeleccionada", fecha);
  window.location.href = "/tecnico/detallesVisitas"; 
}


document.addEventListener("DOMContentLoaded", () => {
  cargarVista("cronograma"); 
});