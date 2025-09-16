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

        if(visitas.length === 0){
            cont.innerHTML = `<p>No hay visitas programadas para este día.</p>`;
            return;
        }
        
        console.log(visitas)


        visitas.forEach(v => {
            const div = document.createElement("div");
            div.classList.add("visita");

            const equiposContainer = document.createElement("div");
                equiposContainer.classList.add("equipos-container");

                if (v.equipos && v.equipos.length > 0) {
                    v.equipos.forEach(eq => {
                        const eqDiv = document.createElement("div");
                        eqDiv.classList.add("equipo-item");
                        eqDiv.textContent = `${eq.id} - ${eq.marca} ${eq.modelo} `;

                        // Botón por cada equipo
                        const btn = document.createElement("button");
                        btn.textContent = "Crear Formulario"; // cambia esto al texto que necesites
                        btn.addEventListener("click", () => {
                            console.log("Botón de equipo clickeado:", eq);
                            // Aquí puedes agregar la acción que quieras
                        });

                        eqDiv.appendChild(btn);
                        equiposContainer.appendChild(eqDiv);
                    });
                } else {
                    equiposContainer.textContent = "No hay equipos asignados";
                }

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
            div.appendChild(equiposContainer);
            cont.appendChild(div);
        });

    } catch (e) {
        console.error(e);
    }
});
