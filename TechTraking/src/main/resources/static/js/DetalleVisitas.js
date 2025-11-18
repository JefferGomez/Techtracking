// =================================================================
// FUNCIÓN PARA MOSTRAR MODALES BONITOS
// =================================================================
function mostrarModal(mensaje, tipo = 'info') {
    const modalAnterior = document.getElementById('customModal');
    if (modalAnterior) {
        modalAnterior.remove();
    }

    const iconos = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    const colores = {
        success: '#4CAF50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196F3'
    };

    const modal = document.createElement('div');
    modal.id = 'customModal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content modal-${tipo}">
                <div class="modal-icon">${iconos[tipo]}</div>
                <p class="modal-message">${mensaje}</p>
                <button class="modal-btn" style="background: ${colores[tipo]}">Aceptar</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    setTimeout(() => {
        modal.querySelector('.modal-content').classList.add('show');
    }, 10);

    const btnCerrar = modal.querySelector('.modal-btn');
    const overlay = modal.querySelector('.modal-overlay');

    const cerrarModal = () => {
        modal.querySelector('.modal-content').classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    };

    btnCerrar.addEventListener('click', cerrarModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            cerrarModal();
        }
    });
}

// =================================================================
// CÓDIGO PRINCIPAL
// =================================================================
console.log(localStorage.getItem("fechaSeleccionada"));

document.addEventListener("DOMContentLoaded", async () => {
    const fecha = localStorage.getItem("fechaSeleccionada");
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const btnBurger = document.getElementById('btn-burger');
    const menuLinks = document.querySelectorAll('.menu a');

    const toggleSidebar = () => {
        sidebar.classList.toggle('show');
        overlay.classList.toggle('show');
    };
    btnBurger.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href) {
                window.location.href = href;
            }
            if (sidebar.classList.contains('show')) toggleSidebar();
        });
    });

    if (!fecha) {
        mostrarModal("No se seleccionó ninguna fecha.", 'warning');
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

            const btnIniciar = document.createElement("button");
            btnIniciar.textContent = "Iniciar Visita";
            btnIniciar.classList.add("btn-iniciar");

            const btnFinalizar = document.createElement("button");
            btnFinalizar.textContent = "Finalizar Visita";
            btnFinalizar.classList.add("btn-finalizar");
            btnFinalizar.style.display = "none";

            const equiposContainer = document.createElement("div");
            equiposContainer.classList.add("equipos-container");

            if (v.equipos && v.equipos.length > 0) {
                v.equipos.forEach(eq => {
                    const eqDiv = document.createElement("div");
                    eqDiv.classList.add("equipo-item");
                    eqDiv.textContent = `${eq.id} - ${eq.marca} ${eq.modelo} `;

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

            if(v.estado === "INICIADA") {
                btnIniciar.style.display = "none";
                btnFinalizar.style.display = "inline-block";
                equiposContainer.querySelectorAll("button").forEach(b => b.disabled = false);
            } else if(v.estado === "FINALIZADA") {
                btnIniciar.style.display = "none";
                btnFinalizar.style.display = "none";
                equiposContainer.querySelectorAll("button").forEach(b => b.disabled = true);
            }

            btnIniciar.addEventListener("click", async () => {
                try {
                    const res = await fetch(`/tecnico/iniciarVisita/${v.id}`, { method: "PUT" });
                    if (!res.ok) throw new Error("No se pudo iniciar la visita");

                    equiposContainer.querySelectorAll("button").forEach(b => b.disabled = false);
                    btnIniciar.style.display = "none";
                    btnFinalizar.style.display = "inline-block";
                    console.log("Visita iniciada:", v.id);
                    mostrarModal("Visita iniciada correctamente.", 'success');

                } catch (err) {
                    console.error("Error al iniciar visita:", err);
                    mostrarModal("No se pudo iniciar la visita. Intenta de nuevo.", 'error');
                }
            });

            btnFinalizar.addEventListener("click", async () => {
                equiposContainer.querySelectorAll("button").forEach(b => b.disabled = true);
                btnFinalizar.disabled = true;

                console.log("Visita finalizada:", v.id);

                try {
                    const correoCliente = encodeURIComponent(v.cliente.correo);
                    const resCorreo = await fetch(`/tecnico/finalizarVisita?correoCliente=${correoCliente}`, {
                        method: "POST"
                    });
                    if (!resCorreo.ok) throw new Error("Error al enviar correos");

                    const resEstado = await fetch(`/tecnico/finalizarVisita/${v.id}`, { method: "PUT" });
                    if (!resEstado.ok) throw new Error("Error al actualizar estado");

                    v.estado = "FINALIZADA";
                    btnIniciar.style.display = "none";
                    btnFinalizar.style.display = "none";

                    mostrarModal("Visita finalizada y correos enviados correctamente.", 'success');
                } catch (e) {
                    console.error(e);
                    mostrarModal("Error al finalizar visita. Intenta de nuevo.", 'error');
                }
            });

            div.appendChild(btnIniciar);
            div.appendChild(btnFinalizar);
            div.appendChild(equiposContainer);
            cont.appendChild(div);
        });

    } catch (e) {
        console.error(e);
        mostrarModal("Error al cargar las visitas. Por favor, recarga la página.", 'error');
    }
});