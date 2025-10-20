console.log(localStorage.getItem("fechaSeleccionada"));

document.addEventListener("DOMContentLoaded", async () => {
    const fecha = localStorage.getItem("fechaSeleccionada");
    if (!fecha) {
        alert("No se seleccionó ninguna fecha.");
        return;
    }

    try {
        const res = await fetch(`/tecnico/visitasDia?fecha=${fecha}`);
        if (!res.ok) throw new Error("Error al cargar las visitas del día");

        const visitas = await res.json();

        const cont = document.getElementById("visitasDia");
        cont.innerHTML = "";

        if (visitas.length === 0) {
            cont.innerHTML = `<p>No hay visitas programadas para este día.</p>`;
            return;
        }

        console.log(visitas);

        visitas.forEach(v => {
            const div = document.createElement("div");
            div.classList.add("visita");

            // Datos de la visita
            div.innerHTML = `
                <p><strong>Cliente:</strong> ${v.cliente.nombre}</p>
                <p><strong>Nit-Cliente:</strong> ${v.cliente.id}</p>
                <p><strong>Dir. Cliente:</strong> ${v.cliente.direccion}</p>
                <p><strong>Tel. Cliente:</strong> ${v.cliente.telefono}</p>
                <p><strong>Correo Cliente:</strong> ${v.cliente.correo}</p>
                <p><strong>Fecha:</strong> ${v.fecha}</p>
                <p><strong>Estado:</strong> ${v.estado}</p>
                <p><strong>Tipo:</strong> ${v.tipoServicio}</p>
                <p><strong>Equipos:</strong></p>
            `;

            // Botón Iniciar Visita
            const btnIniciar = document.createElement("button");
            btnIniciar.textContent = "Iniciar Visita";
            btnIniciar.classList.add("btn-iniciar");

            // Botón Finalizar (inicialmente oculto)
            const btnFinalizar = document.createElement("button");
            btnFinalizar.textContent = "Finalizar Visita";
            btnFinalizar.classList.add("btn-finalizar");
            btnFinalizar.style.display = "none";

            // Contenedor de equipos
            const equiposContainer = document.createElement("div");
            equiposContainer.classList.add("equipos-container");

            if (v.equipos && v.equipos.length > 0) {
                v.equipos.forEach(eq => {
                    const eqDiv = document.createElement("div");
                    eqDiv.classList.add("equipo-item");
                    eqDiv.textContent = `${eq.id} - ${eq.marca} ${eq.modelo} `;

                    // Botón de formulario por equipo (deshabilitado al inicio)
                    const btn = document.createElement("button");
                    btn.textContent = "Crear Formulario";
                    btn.disabled = true;

                    btn.addEventListener("click", () => {
                        console.log("Formulario para equipo:", eq);
                        window.location.href = `/tecnico/formulario/${eq.id}`;
                    });

                    eqDiv.appendChild(btn);
                    equiposContainer.appendChild(eqDiv);
                });
            } else {
                equiposContainer.textContent = "No hay equipos asignados";
            }

            // Acción al iniciar visita
            btnIniciar.addEventListener("click", () => {
                equiposContainer.querySelectorAll("button").forEach(b => b.disabled = false);
                btnIniciar.style.display = "none";
                btnFinalizar.style.display = "inline-block";
                console.log("Visita iniciada:", v.id);
            });

            // Acción al finalizar visita
            btnFinalizar.addEventListener("click", async () => {
                equiposContainer.querySelectorAll("button").forEach(b => b.disabled = true);
                btnFinalizar.disabled = true;

                console.log("Visita finalizada:", v.id);

                // 🔹 Aquí deberías enviar al backend los PDFs generados
                // Ejemplo de envío al backend:
                try {
                    const res = await fetch(`/tecnico/finalizarVisita/${v.id}`, {
                        method: "POST"
                    });
                    if (res.ok) {
                        alert("Visita finalizada y correos enviados al cliente.");
                    } else {
                        alert("Error al finalizar la visita.");
                    }
                } catch (e) {
                    console.error("Error finalizando visita:", e);
                }
            });

            div.appendChild(btnIniciar);
            div.appendChild(btnFinalizar);
            div.appendChild(equiposContainer);
            cont.appendChild(div);
        });

    } catch (e) {
        console.error(e);
    }
});
