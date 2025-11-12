// =================================================================
// FUNCIÓN PARA MOSTRAR MODALES BONITOS
// =================================================================

/**
 * Muestra un modal personalizado en lugar de alert()
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - 'success', 'error', 'warning', 'info'
 */
function mostrarModal(mensaje, tipo = 'info') {
    // Remover modal anterior si existe
    const modalAnterior = document.getElementById('customModal');
    if (modalAnterior) {
        modalAnterior.remove();
    }

    // Iconos según el tipo
    const iconos = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    // Colores según el tipo
    const colores = {
        success: '#4CAF50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196F3'
    };

    // Crear el modal
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

    // Agregar al body
    document.body.appendChild(modal);

    // Agregar animación de entrada
    setTimeout(() => {
        modal.querySelector('.modal-content').classList.add('show');
    }, 10);

    // Event listener para cerrar
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
// CONFIGURACIÓN Y VARIABLES GLOBALES
// =================================================================

const sidebar = document.getElementById('sidebar');
const burgerButton = document.getElementById('btn-burger');
const overlay = document.getElementById('overlay');
const vincularForm = document.getElementById('vincularEquipoForm');
const buscarClienteInput = document.getElementById('buscarCliente');
const btnBuscarCliente = document.getElementById('btnBuscarCliente');
const vincularButton = document.querySelector('.vincular');

let clienteSeleccionadoId = null;

// =================================================================
// 1. LÓGICA DEL SIDEBAR Y NAVEGACIÓN
// =================================================================

if (sidebar && burgerButton && overlay) {
    const toggleSidebar = () => {
        const isExpanded = sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        burgerButton.setAttribute('aria-expanded', isExpanded);
    };

    burgerButton.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);
}

// =================================================================
// 2. LÓGICA DE BÚSQUEDA Y SELECCIÓN DE CLIENTE
// =================================================================

/**
 * Resetea y limpia los datos del cliente mostrados
 */
const resetClienteDatos = () => {
    document.getElementById('NIT').textContent = 'N/A';
    document.getElementById('Empresa').textContent = 'N/A';
    document.getElementById('Dirección').textContent = 'N/A';
    document.getElementById('Teléfono').textContent = 'N/A';
    document.getElementById('Correo').textContent = 'N/A';
    if (vincularButton) vincularButton.disabled = true;
    clienteSeleccionadoId = null;
};

/**
 * Busca un cliente por nombre o ID
 */
const buscarCliente = () => {
    const query = buscarClienteInput.value.trim();

    if (!query) {
        mostrarModal("Por favor, introduce el nombre o ID del cliente.", 'warning');
        return;
    }

    console.log("🔍 Buscando cliente:", query);

    // Mostrar indicador de búsqueda
    if (btnBuscarCliente) {
        btnBuscarCliente.textContent = '🔍 Buscando...';
        btnBuscarCliente.disabled = true;
    }

    // Usar el MISMO endpoint que dashboard-clientes.js
    fetch("/admin/clientes")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error ${response.status}: No se pudo obtener la lista de clientes`);
            }
            return response.json();
        })
        .then(clientes => {
            console.log("✅ Clientes obtenidos:", clientes);

            // Buscar cliente que coincida con el query (nombre o ID)
            const queryLower = query.toLowerCase();
            const clienteEncontrado = clientes.find(c =>
                c.nombre?.toLowerCase().includes(queryLower) ||
                c.id?.toString() === query
            );

            if (clienteEncontrado) {
                console.log("✅ Cliente encontrado:", clienteEncontrado);

                // Mostrar los datos del cliente
                document.getElementById('NIT').textContent = clienteEncontrado.id || 'N/D';
                document.getElementById('Empresa').textContent = clienteEncontrado.nombre || 'N/D';
                document.getElementById('Dirección').textContent = clienteEncontrado.direccion || 'N/D';
                document.getElementById('Teléfono').textContent = clienteEncontrado.telefono || 'N/D';
                document.getElementById('Correo').textContent = clienteEncontrado.correo || 'N/D';

                // Guardar ID del cliente
                clienteSeleccionadoId = clienteEncontrado.id;
                sessionStorage.setItem("clienteId", clienteEncontrado.id);

                // Habilitar botón de vincular
                if (vincularButton) vincularButton.disabled = false;

                mostrarModal(`Cliente "${clienteEncontrado.nombre}" encontrado.`, 'success');
            } else {
                resetClienteDatos();
                mostrarModal(`No se encontró ningún cliente con: "${query}"`, 'error');
            }
        })
        .catch(error => {
            console.error("❌ Error al buscar cliente:", error);
            mostrarModal("Error al buscar el cliente. Verifica la consola.", 'error');
            resetClienteDatos();
        })
        .finally(() => {
            // Restaurar botón de búsqueda
            if (btnBuscarCliente) {
                btnBuscarCliente.textContent = 'Buscar';
                btnBuscarCliente.disabled = false;
            }
        });
};

// Event listener para el botón de búsqueda
if (btnBuscarCliente) {
    btnBuscarCliente.addEventListener('click', buscarCliente);
}

// También permitir buscar con Enter
if (buscarClienteInput) {
    buscarClienteInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            buscarCliente();
        }
    });
}

// =================================================================
// 3. LÓGICA DE VINCULACIÓN DE EQUIPO
// =================================================================

vincularForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Verificar que hay un cliente seleccionado
    if (!clienteSeleccionadoId) {
        mostrarModal("Por favor, busca y selecciona un cliente primero.", 'warning');
        return;
    }

    // Recolectar datos del formulario
    const equipoData = {
        marca: document.getElementById('nombreEquipo').value.trim(),
        modelo: document.getElementById('modelo').value.trim(),
        serial: document.getElementById('serie').value.trim(),
        tipo: document.getElementById('tipo').value,
        clienteId: clienteSeleccionadoId
    };

    // Validación
    if (!equipoData.marca || !equipoData.modelo ||
        !equipoData.serial || !equipoData.tipo) {
        mostrarModal("Por favor, completa todos los campos del equipo.", 'warning');
        return;
    }

    console.log("📦 Datos del equipo a enviar:", equipoData);

    // Mostrar indicador de carga
    const submitBtn = vincularForm.querySelector('button[type="submit"]');
    const textoOriginal = submitBtn.textContent;
    submitBtn.textContent = '⏳ Vinculando...';
    submitBtn.disabled = true;

    // Enviar al backend
    fetch("/admin/equipos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(equipoData)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(text || "Error al vincular equipo");
            });
        }
        return response.json();
    })
    .then(data => {
        console.log("✅ Equipo vinculado:", data);
        mostrarModal("Equipo vinculado exitosamente", 'success');

        // Limpiar formulario después de 1 segundo
        setTimeout(() => {
            vincularForm.reset();
            resetClienteDatos();
            buscarClienteInput.value = '';
        }, 1000);
    })
    .catch(error => {
        console.error("❌ Error al vincular equipo:", error);
        mostrarModal(`Error al vincular el equipo: ${error.message}`, 'error');
    })
    .finally(() => {
        // Restaurar botón
        submitBtn.textContent = textoOriginal;
        submitBtn.disabled = false;
    });
});

// =================================================================
// 4. INICIALIZACIÓN
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    resetClienteDatos();
    console.log("✅ Sistema de vinculación inicializado");
});