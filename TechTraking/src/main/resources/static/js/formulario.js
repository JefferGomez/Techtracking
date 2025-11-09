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

    // -----------------------------------------------------------------
    // 2. Pre-Carga de Datos (Consecutivo, Técnico y DATOS DEL EQUIPO)
    // -----------------------------------------------------------------
    const consecutivoInput = document.getElementById('consecutivo');
    const tecnicoUsuarioInput = document.querySelector('input[name="tecnico_usuario"]');
    const fechaInput = document.getElementById('fecha');

    // Inputs del equipo
    const clienteInput = document.querySelector('input[name="cliente"]');
    const marcaInput = document.querySelector('input[name="marca"]');
    const modeloInput = document.querySelector('input[name="modelo"]');
    const serieInput = document.querySelector('input[name="serie"]');

    /**
     * Obtener el siguiente número consecutivo
     */
    // const obtenerConsecutivo = async () => {
    //     try {
    //         const response = await fetch(`${API_TECNICO}/next-consecutivo`);
    //         if (!response.ok) throw new Error("No se pudo obtener el consecutivo.");
    //         const data = await response.json();
    //         return data.consecutivo || (Math.floor(Math.random() * 10000) + 1000);
    //     } catch (error) {
    //         console.error('Error al obtener el consecutivo:', error);
    //         return Math.floor(Math.random() * 10000) + 1000;
    //     }
    // };

    /**
     * Obtener el técnico logueado
     */
    const obtenerTecnicoServimarket = async () => {
        try {
            return 'Jeisson Henao';
        } catch (error) {
            console.error('Error al obtener el técnico:', error);
            return 'Técnico';
        }
    };

    /**
     * NUEVO: Cargar datos del equipo desde el backend
     */
    const cargarDatosEquipo = async () => {
        const equipoId = sessionStorage.getItem("equipoId");
        const clienteId = sessionStorage.getItem("clienteId");

        if (!equipoId && !clienteId) {
            console.log("ℹ️ No hay equipo seleccionado. Formulario vacío.");
            return;
        }

        try {
            let equipoData = null;
            let clienteData = null;

            // Obtener datos del equipo si existe
            if (equipoId) {
                const equipoRes = await fetch(`${API_BASE_URL}/admin/equipos/${equipoId}`);
                if (equipoRes.ok) {
                    equipoData = await equipoRes.json();
                    console.log("✅ Equipo cargado:", equipoData);
                }
            }

            // Obtener datos del cliente si existe
            if (clienteId) {
                const clienteRes = await fetch(`${API_BASE_URL}/admin/clientes/${clienteId}`);
                if (clienteRes.ok) {
                    clienteData = await clienteRes.json();
                    console.log("✅ Cliente cargado:", clienteData);
                }
            }

            // Rellenar el formulario con los datos obtenidos
            if (equipoData) {
                if (marcaInput) marcaInput.value = equipoData.marca || '';
                if (modeloInput) modeloInput.value = equipoData.modelo || '';
                if (serieInput) serieInput.value = equipoData.serie || '';

                // Si el equipo tiene el tipo, seleccionarlo
                if (equipoData.tipo) {
                    const tipoRadio = document.querySelector(`input[name="tipo_impresora"][value="${equipoData.tipo}"]`);
                    if (tipoRadio) tipoRadio.checked = true;
                }
            }

            if (clienteData) {
                if (clienteInput) clienteInput.value = clienteData.nombre || '';
            }

            // Si el equipo tiene clienteId pero no cargamos el cliente separado
            if (equipoData && equipoData.cliente && !clienteData) {
                if (clienteInput) clienteInput.value = equipoData.cliente.nombre || equipoData.cliente || '';
            }

        } catch (error) {
            console.error("❌ Error al cargar datos del equipo:", error);
            alert("⚠️ No se pudieron cargar los datos del equipo. Puedes ingresarlos manualmente.");
        }
    };

    /** Inicializa TODOS los campos del formulario */
    const inicializarCampos = async () => {
        // consecutivoInput.value = await obtenerConsecutivo();
        tecnicoUsuarioInput.value = await obtenerTecnicoServimarket();

        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        fechaInput.value = `${yyyy}-${mm}-${dd}`;

        // NUEVO: Cargar datos del equipo
        await cargarDatosEquipo();
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

    // -----------------------------------------------------------------
    // 4. Lógica de Envío (Guardar Reporte y Generar PDF)
    // -----------------------------------------------------------------

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

            // Verificar si hay un equipoId en sessionStorage (desde vista equipo)
            const equipoId = sessionStorage.getItem("equipoId");
            const clienteId = sessionStorage.getItem("clienteId");

            const data = {
                // IDs (si existen)
                equipoId: equipoId ? parseInt(equipoId) : null,
                clienteId: clienteId ? parseInt(clienteId) : null,

                // Datos del equipo
                cliente: formData.get("cliente"),
                marca: formData.get("marca"),
                modelo: formData.get("modelo"),
                serie: formData.get("serie"),
                tipo: formData.get("tipo_impresora"),
                garantia: formData.get("garantia") === "on",
                fecha: formData.get("fecha"),
                consecutivo: formData.get("consecutivo"),

                // Estado General
                equipoEnciende: valorBooleano("encendido"),
                estaOperando: valorBooleano("operando"),
                estaPartido: valorBooleano("prendido"),
                estaManchado: valorBooleano("manchas"),

                // Piezas Faltantes
                tornillos: valorBooleano("tornillos"),
                tapas: valorBooleano("tapas"),
                display: valorBooleano("display"),
                tarjetasElectronicas: valorBooleano("tarjetas"),
                botones: valorBooleano("botones"),
                cabezal: valorBooleano("cabezal"),
                otrasPiezas: formData.get("otras_piezas"),

                // Parte Mecánica
                oxido: valorBooleano("ejes"),
                ruidos: valorBooleano("husillos"),
                piñoneriaEnBuenEstado: valorBooleano("pletinas"),
                correasEnBuenEstado: valorBooleano("cremas"),
                otraMecanica: formData.get("otra_mecanica"),

                // Pantalla
                funciona: valorBooleano("funciona"),
                partida: valorBooleano("pantallaPrendida"),
                lineasQuemadas: valorBooleano("lineas"),
                quemada: valorBooleano("quemada"),

                // Cabezal
                bueno: valorBooleano("cabezal_bueno"),
                lineasBlancas: valorBooleano("lineas_blancas"),
                calibrado: valorBooleano("calibrado"),
                limpio: valorBooleano("limpio"),

                // Rodillo
                buenos: valorBooleano("rodillo"),
                picados: valorBooleano("ruedas"),
                rayados: valorBooleano("alineado"),
                adhesivo: valorBooleano("adecuado"),

                // Estado Electrónico
                humedad: valorBooleano("humedad"),
                tarjetaElectronica: valorBooleano("tarjetasOk"),
                otraElectronica: formData.get("otra_electronica"),

                observaciones: formData.get("observaciones"),

                // Técnico
                tecnicoUsuario: formData.get("tecnico_usuario"),
                tecnicoArea: formData.get("tecnico_area"),

                // Imágenes
                etiquetaBase64: await fileToBase64(etiquetaFile),
                firmaBase64: await fileToBase64(firmaFile),
            };

            console.log("📋 Datos del reporte:", data);

            // 2. Primero crear/obtener el equipo si no existe
            let equipoId = sessionStorage.getItem("equipoId");

            if (!equipoId) {
                // Crear equipo nuevo primero
                const equipoData = {
                    marca: formData.get("marca"),
                    modelo: formData.get("modelo"),
                    serie: formData.get("serie"),
                    tipo: formData.get("tipo_impresora"),
                    clienteId: sessionStorage.getItem("clienteId") || null
                };

                const equipoRes = await fetch(`${API_BASE_URL}/admin/equipos`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(equipoData)
                });

                if (!equipoRes.ok) {
                    throw new Error("Error al crear el equipo");
                }

                const equipoCreado = await equipoRes.json();
                equipoId = equipoCreado.id;
                console.log("✅ Equipo creado:", equipoCreado);
            }

            // Ahora crear la revisión con el equipoId
            data.equipoId = parseInt(equipoId);

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
            // Opción A: Limpiar formulario
            reporteForm.reset();
            inicializarCampos();
            previewEtiqueta.style.display = 'none';
            if (previewFirma) previewFirma.style.display = 'none';

            // Opción B: Redirigir (descomentar si prefieres)
            // setTimeout(() => {
            //     window.location.href = "/tecnico/detallesVisitas";
            // }, 2000);

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
