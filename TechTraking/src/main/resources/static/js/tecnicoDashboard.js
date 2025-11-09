/**
 * ================================================
 * DASHBOARD TÉCNICO - TechTracking
 * ================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const btnBurger = document.getElementById('btn-burger');
    const contenido = document.getElementById('contenido');

    // ============================================
    // FUNCIONALIDAD DEL SIDEBAR MÓVIL
    // ============================================

    const toggleSidebar = () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        const isExpanded = sidebar.classList.contains('active');
        if (btnBurger) {
            btnBurger.setAttribute('aria-expanded', isExpanded);
        }
    };

    if (btnBurger) {
        btnBurger.addEventListener('click', toggleSidebar);
    }

    if (overlay) {
        overlay.addEventListener('click', toggleSidebar);
    }

    // ============================================
    // FUNCIÓN PRINCIPAL PARA CARGAR VISTAS
    // ============================================

    window.cargarVista = async (vista, tecnicoId) => {
        const cont = document.getElementById("contenido");

        // Cerrar sidebar en móvil al seleccionar opción
        if (sidebar && sidebar.classList.contains('active')) {
            toggleSidebar();
        }

        // Marcar enlace activo
        marcarEnlaceActivo(vista);

        // Cargar la vista correspondiente
        if (vista === "cronograma") {
            cont.innerHTML = `
                <div class="vista-cronograma">
                    <h2>📅 Mi Cronograma</h2>
                    <div id="cronograma" class="cronograma-container"></div>
                </div>
            `;
            await cargarCronograma(tecnicoId);
        }
        else if (vista === "chat") {
            cont.innerHTML = `
                <div class="vista-chat">
                    <h2>💬 Chat</h2>
                    <iframe src="/chat-page" style="width:100%;height:600px;border:none;border-radius:8px;"></iframe>
                </div>
            `;
        }
        else {
            cargarInicio();
        }
    };

    // ============================================
    // CARGAR CRONOGRAMA DE VISITAS
    // ============================================

    async function cargarCronograma(tecnicoId) {
        try {
            const res = await fetch(`/tecnico/visitasTecnico`);

            if (!res.ok) {
                throw new Error(`Error ${res.status}: No se pudieron cargar las visitas`);
            }

            const visitas = await res.json();
            const cont = document.getElementById("cronograma");

            if (!cont) {
                console.error("Contenedor 'cronograma' no encontrado");
                return;
            }

            cont.innerHTML = "";

            // Verificar si hay visitas
            if (Object.keys(visitas).length === 0) {
                cont.innerHTML = `
                    <div class="mensaje-vacio">
                        <p>📭 No hay visitas programadas</p>
                    </div>
                `;
                return;
            }

            // Renderizar cada fecha con sus visitas
            Object.entries(visitas).forEach(([fecha, cantidad]) => {
                const div = document.createElement("div");
                div.classList.add("dia-visita");
                div.innerHTML = `
                    <div class="dia-header">
                        <h3>${formatearFecha(fecha)}</h3>
                        <span class="badge-cantidad">${cantidad} visita${cantidad !== 1 ? 's' : ''}</span>
                    </div>
                    <button class="btn-ver-visitas" onclick="verVisitas('${fecha}')">
                        Ver detalles →
                    </button>
                `;
                cont.appendChild(div);
            });

        } catch (error) {
            console.error("Error al cargar cronograma:", error);
            const cont = document.getElementById("cronograma");
            if (cont) {
                cont.innerHTML = `
                    <div class="mensaje-error">
                        <p>❌ Error al cargar las visitas</p>
                        <button onclick="cargarVista('cronograma')" class="btn-reintentar">Reintentar</button>
                    </div>
                `;
            }
        }
    }

    // ============================================
    // VER DETALLES DE VISITAS DE UNA FECHA
    // ============================================

    window.verVisitas = (fecha) => {
        localStorage.setItem("fechaSeleccionada", fecha);
        window.location.href = "/tecnico/detallesVisitas";
    };

    // ============================================
    // FORMATEAR FECHA PARA MOSTRAR
    // ============================================

    function formatearFecha(fechaStr) {
        try {
            const fecha = new Date(fechaStr + 'T00:00:00');
            const opciones = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            return fecha.toLocaleDateString('es-ES', opciones);
        } catch (error) {
            return fechaStr;
        }
    }

    // ============================================
    // MARCAR ENLACE ACTIVO EN EL SIDEBAR
    // ============================================

    function marcarEnlaceActivo(vista) {
        const enlaces = document.querySelectorAll(".sidebar ul li a");
        enlaces.forEach(a => {
            const onclick = a.getAttribute("onclick");
            if (onclick && onclick.includes(vista)) {
                a.classList.add("activo");
            } else {
                a.classList.remove("activo");
            }
        });
    }

    // ============================================
    // VISTA DE INICIO / BIENVENIDA
    // ============================================

    function cargarInicio() {
        contenido.innerHTML = `
            <div class="bienvenida-tecnico">
                <h2>🛠️ Bienvenido al Panel Técnico</h2>
                <p>Selecciona una opción del menú para comenzar</p>
                <div class="acciones-rapidas">
                    <button class="btn-accion" onclick="cargarVista('cronograma')">
                        📅 Ver mi cronograma
                    </button>
                    <button class="btn-accion" onclick="cargarVista('chat')">
                        💬 Ir al chat
                    </button>
                </div>
            </div>
        `;
    }

    // ============================================
    // INICIALIZACIÓN - CARGAR CRONOGRAMA POR DEFECTO
    // ============================================

    console.log('✅ Dashboard Técnico inicializado correctamente');
    cargarVista("cronograma");
});