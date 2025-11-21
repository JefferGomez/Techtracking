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
// LÓGICA DEL FORMULARIO DE REGISTRO
// =================================================================

document.getElementById('registroCliente').addEventListener('submit', function(e) {
    e.preventDefault();

    // Capturar valores del formulario
    const nombre = document.getElementById('empresa').value.trim();
    const id = document.getElementById('nit').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const email = document.getElementById('email').value.trim();
    const aceptarTerminos = document.getElementById('terminos').checked;

    // Validación de términos
    if (!aceptarTerminos) {
        mostrarModal('Debes aceptar los términos y condiciones', 'warning');
        return;
    }

    // Crear el objeto cliente
    const cliente = {
        nombre: nombre,
        id: id,
        direccion: direccion,
        telefono: telefono,
        correo: email,
        aceptarTerminos: aceptarTerminos
    };

    // Mostrar indicador de carga en el botón
    const submitBtn = this.querySelector('button[type="submit"]');
    const textoOriginal = submitBtn.textContent;
    submitBtn.textContent = '⏳ Registrando...';
    submitBtn.disabled = true;

    // Enviar datos al backend
    fetch('http://localhost:8080/admin/crearCliente', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return response.text().then(text => {
                throw new Error(text || 'Error al registrar el cliente');
            });
        }
    })
    .then(data => {
        console.log('✅ Cliente registrado exitosamente:', data);
        mostrarModal('Cliente registrado con éxito', 'success');
        
        // Limpiar formulario después de 1 segundo
        setTimeout(() => {
            document.getElementById('registroCliente').reset();
        }, 1000);
    })
    .catch(error => {
        console.error('❌ Error al registrar:', error);
        mostrarModal('Hubo un problema al registrar el cliente: ' + error.message, 'error');
    })
    .finally(() => {
        // Restaurar botón
        submitBtn.textContent = textoOriginal;
        submitBtn.disabled = false;
    });
});

// =================================================================
// LÓGICA DEL SIDEBAR (si aplica)
// =================================================================

const sidebar = document.getElementById('sidebar');
const burgerButton = document.getElementById('btn-burger');
const overlay = document.getElementById('overlay');

if (sidebar && burgerButton && overlay) {
    const toggleSidebar = () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        const isExpanded = sidebar.classList.contains('active');
        burgerButton.setAttribute('aria-expanded', isExpanded);
    };

    burgerButton.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);
}

console.log('✅ Sistema de registro de clientes inicializado');