

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
        alert("⚠️ Por favor, introduce el nombre o ID del cliente.");
        return;
    }

    console.log("🔍 Buscando cliente:", query);

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

                alert(`✅ Cliente "${clienteEncontrado.nombre}" encontrado.`);
            } else {
                resetClienteDatos();
                alert(`❌ No se encontró ningún cliente con: "${query}"`);
            }
        })
        .catch(error => {
            console.error("❌ Error al buscar cliente:", error);
            alert("❌ Error al buscar el cliente. Verifica la consola.");
            resetClienteDatos();
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
        alert("⚠️ Por favor, busca y selecciona un cliente primero.");
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
        alert("⚠️ Por favor, completa todos los campos del equipo.");
        return;
    }

    console.log("📦 Datos del equipo a enviar:", equipoData);

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
        alert("✅ Equipo vinculado exitosamente");

        // Limpiar formulario
        vincularForm.reset();
        resetClienteDatos();
        buscarClienteInput.value = '';
    })
    .catch(error => {
        console.error("❌ Error al vincular equipo:", error);
        alert(`❌ Error: ${error.message}`);
    });
});

// =================================================================
// 4. INICIALIZACIÓN
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    resetClienteDatos();
    console.log("✅ Sistema de vinculación inicializado");
});