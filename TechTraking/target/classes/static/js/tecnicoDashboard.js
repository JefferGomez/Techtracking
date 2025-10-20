async function cargarVista(vista,tecnicoId) {
  const cont = document.getElementById("contenido");

  if (vista === "cronograma") {
    // aquí insertamos el cronograma
    cont.innerHTML = `
      <h2>Mi Cronograma</h2>
      <div id="cronograma"></div>
    `;
    cargarCronograma(); // ejemplo técnico id=1
  }

  if (vista === "chat") {
    // como ya tienes el chat, aquí lo incrustas
    cont.innerHTML = `
      <h2>Chat</h2>
      <iframe src="chat.html" style="width:100%;height:500px;border:none;"></iframe>
    `;
  }
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