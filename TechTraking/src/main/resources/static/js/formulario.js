/**
 * =================================================================
 * SCRIPT.JS - Lógica de TechTracking - Formulario de Mantenimiento
 * =================================================================
 */

// URL base de tu API de Spring Boot
const API_BASE_URL = 'http://localhost:8080';
const API_TECNICO = `${API_BASE_URL}/tecnico`;

document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------------------
    // 1. Elementos del DOM y Lógica de Sidebar
    // -----------------------------------------------------------------
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const btnBurger = document.getElementById('btn-burger');
    const menuLinks = document.querySelectorAll('.menu a');
    const btnLogout = document.querySelector('.btn-logout');
    const reporteForm = document.getElementById('reporteForm');
    const formContenedor = document.getElementById('form-contenedor');

    // Botón hamburguesa y Overlay
    const toggleSidebar = () => {
        sidebar.classList.toggle('show');
        overlay.classList.toggle('show');
    };
    btnBurger.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);

    // Navegación Sidebar
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


    /** Inicializa TODOS los campos del formulario */
    const inicializarCampos = async () => {

        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        fechaInput.value = `${yyyy}-${mm}-${dd}`;
    };

    inicializarCampos();

    // -----------------------------------------------------------------
    // 3. Previsualización de Archivos
    // -----------------------------------------------------------------
    const inputEtiqueta = document.getElementById('inputEtiqueta');
    const previewEtiqueta = document.getElementById('previewEtiqueta');
    const inputFirma = document.querySelector('input[name="firma"]');
    const previewFirma = document.getElementById('previewFirma');

    function mostrarVistaPrevia(input, previewElement) {
        const file = input.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = function (e) {
                previewElement.src = e.target.result;
                previewElement.style.display = "block";
            };
            reader.readAsDataURL(file);
        } else {
            previewElement.style.display = "none";
            previewElement.src = "";
        }
    }

    inputEtiqueta.addEventListener("change", function () {
        mostrarVistaPrevia(this, previewEtiqueta);
    });

    if (inputFirma) {
        inputFirma.addEventListener("change", function () {
            mostrarVistaPrevia(this, previewFirma);
        });
    }

    /**
     * Helper para convertir radio buttons a boolean
     */
    const valorBooleano = (name) => {
        const val = document.querySelector(`input[name="${name}"]:checked`);
        return val ? val.value === "SI" : false;
    };

    /**
     * Convierte archivo a Base64
     */
    const fileToBase64 = (file) => new Promise((resolve, reject) => {
        if (!file || file.size === 0) return resolve(null);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    /**
     * Manejador principal al enviar el formulario
     */
    reporteForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Mostrar indicador de carga
        const submitBtn = reporteForm.querySelector('button[type="submit"]');
        const textoOriginal = submitBtn.textContent;
        submitBtn.textContent = '⏳ Guardando...';
        submitBtn.disabled = true;

        try {
            // 1. Recolectar datos del formulario
            const formData = new FormData(reporteForm);

            const etiquetaFile = inputEtiqueta.files[0];
            const firmaFile = inputFirma ? inputFirma.files[0] : null;
            const clienteId = parseInt(formData.get("clienteId"));
            const equipoId = parseInt(formData.get("equipoId"));

            if (isNaN(clienteId) || isNaN(equipoId)) {
                alert("Debe seleccionar un Cliente y un Equipo válidos.");
                return; // evita enviar datos inválidos
            }

            const data = {
                // IDs (si existen)
                equipoId:equipoId,
                clienteId:clienteId,

                // Tipo y garantía
                tipoImpresora: formData.get("tipo_impresora"), // el backend debe parsear a TipoImpresora
                equipoGarantia: valorBooleano("garantia"),

                // Otros campos de texto
                otroPiezaFaltante: formData.get("otras_piezas"),
                otroParteMecanica: formData.get("otra_mecanica"),
                otroEstadoElectronico: formData.get("otra_electronica"),

                // Checklist
                // ESTADO GENERAL
                equipoEnciende: valorBooleano("encendido"),
                estaOperando: valorBooleano("operando"),
                estaPartido: valorBooleano("prendido"),
                estaManchado: valorBooleano("manchas"),

                // PIEZAS FALTANTES
                tornillos: valorBooleano("tornillos"),
                tapas: valorBooleano("tapas"),
                display: valorBooleano("display"),
                tarjetasElectronicas: valorBooleano("tarjetas"),
                botones: valorBooleano("botones"),
                cabezal: valorBooleano("cabezal"),

                // PARTE MECÁNICA
                oxido: valorBooleano("ejes"),
                ruidos: valorBooleano("husillos"),
                piñoneriaEnBuenEstado: valorBooleano("pletinas"),
                correasEnBuenEstado: valorBooleano("cremas"),

                // PANTALLA
                funciona: valorBooleano("funciona"),
                partida: valorBooleano("pantallaPrendida"),
                lineasQuemadas: valorBooleano("lineas"),
                quemada: valorBooleano("quemada"),

                // CABEZAL DE IMPRESIÓN
                bueno: valorBooleano("cabezal_bueno"),
                lineasBlancas: valorBooleano("lineas_blancas"),
                calibrado: valorBooleano("calibrado"),
                limpio: valorBooleano("limpio"),

                // RODILLO DE IMPRESIÓN
                buenos: valorBooleano("rodillo"),
                picados: valorBooleano("ruedas"),
                rayados: valorBooleano("alineado"),
                adhesivo: valorBooleano("adecuado"),

                // ESTADO ELECTRÓNICO
                humedad: valorBooleano("humedad"),
                tarjetaElectronica: valorBooleano("tarjetasOk"),

                // Otros datos
                observaciones: formData.get("observaciones"),
                fecha: formData.get("fecha"), // enviar como string yyyy-MM-dd y el backend parsea a LocalDate

                // Imágenes
                // etiquetaBase64: await fileToBase64(etiquetaFile),
                // firmaBase64: await fileToBase64(firmaFile),
            };

            console.log("📋 Datos del reporte:", data);

            // 3. Enviar revisión al backend
            const res = await fetch(`${API_TECNICO}/crearRevisiones`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                throw new Error(`Error ${res.status}: ${await res.text()}`);
            }

            const savedRevision = await res.json();
            console.log("✅ Revisión guardada:", savedRevision);

            // 5. Limpiar formulario o redirigir
            

            //Opción B: Redirigir (descomentar si prefieres)
            setTimeout(() => {
                window.location.href = "/tecnico/detallesVisitas";
            }, 2000);

        } catch (error) {
            console.error("❌ Error completo:", error);
            alert(`❌ Error al guardar el reporte:\n\n${error.message}\n\nRevisa la consola para más detalles.`);
        } finally {
            // Restaurar botón
            submitBtn.textContent = textoOriginal;
            submitBtn.disabled = false;
        }
    });
});
