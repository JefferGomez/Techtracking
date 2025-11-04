/**
 * =================================================================
 * SCRIPT.JS - Lógica de TechTracking - Formulario de Mantenimiento
 * =================================================================
 */

// URL base de tu API de Spring Boot
const API_BASE_URL = 'http://localhost:8080';
const API_TECNICO = `${API_BASE_URL}/tecnico`;
const API_EQUIPO = `${API_BASE_URL}/api/equipo`; // Asumiendo un endpoint para traer datos de equipo/cliente

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
            const target = link.textContent.trim().toLowerCase().split(' ')[1];

            switch (target) {
                case 'clientes':
                    window.location.href = '/clientes.html'; 
                    break;
                case 'calendario':
                    window.location.href = '/calendario.html';
                    break;
                case 'chat':
                    window.location.href = '/chat.html';
                    break;
                default:
                    console.warn('Opción de menú no reconocida:', target);
            }
            if (sidebar.classList.contains('show')) toggleSidebar();
        });
    });

    // Cerrar Sesión
    btnLogout.addEventListener('click', () => {
        if (confirm('¿Estás seguro que deseas cerrar la sesión?')) {
            // Lógica de deslogueo en el backend aquí (si aplica)
            window.location.href = '/login.html';
        }
    });

    // -----------------------------------------------------------------
    // 2. Pre-Carga de Datos (Consecutivo y Técnico)
    // -----------------------------------------------------------------
    const consecutivoInput = document.getElementById('consecutivo');
    const tecnicoUsuarioInput = document.querySelector('input[name="tecnico_usuario"]');
    const fechaInput = document.getElementById('fecha');

    /**
     * Simula obtener el siguiente número consecutivo de la BD SM.
     */
    const obtenerConsecutivo = async () => {
        try {
            // ** Reemplazar con la URL REAL de tu API para el consecutivo **
            const response = await fetch(`${API_TECNICO}/next-consecutivo`); 
            if (!response.ok) throw new Error("No se pudo obtener el consecutivo.");
            const data = await response.json();
            return data.consecutivo || (Math.floor(Math.random() * 10000) + 1000); // Fallback aleatorio
        } catch (error) {
            console.error('Error al obtener el consecutivo:', error);
            return 'ERROR';
        }
    };

    /**
     * Simula obtener el técnico logueado (Servimarket).
     */
    const obtenerTecnicoServimarket = async () => {
        try {
            // ** Reemplazar con la URL REAL para obtener el usuario actual **
            // Esto es una simulación si no tienes sesión activa
            return 'Jeisson Henao'; 
        } catch (error) {
            console.error('Error al obtener el técnico:', error);
            return 'Error de Carga';
        }
    };

    /** Inicializa Consecutivo, Técnico y Fecha */
    const inicializarCampos = async () => {
        consecutivoInput.value = await obtenerConsecutivo();
        tecnicoUsuarioInput.value = await obtenerTecnicoServimarket();
        
        // Establece la fecha actual
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
    const inputFirma = document.getElementById('inputFirma');
    const previewFirma = document.getElementById('previewFirma');

    /**
     * Muestra la vista previa de una imagen de entrada de archivo
     */
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

    inputFirma.addEventListener("change", function () {
        mostrarVistaPrevia(this, previewFirma);
    });


    // -----------------------------------------------------------------
    // 4. Lógica de Envío (Guardar Reporte y Generar PDF)
    // -----------------------------------------------------------------
    const { jsPDF } = window.jspdf;

    /**
     * Helper para convertir "SI"/"NO" de los radio buttons a boolean.
     */
    const valorBooleano = (name) => {
        const val = document.querySelector(`input[name="${name}"]:checked`);
        return val ? val.value === "SI" : false;
    };
    
    /**
     * Convierte un objeto File a una cadena Base64 para incluir en el JSON.
     */
    const fileToBase64 = (file) => new Promise((resolve, reject) => {
        if (!file || file.size === 0) return resolve(null);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    /**
     * Genera el PDF a partir del HTML del formulario.
     */
    const generarPDF = async (revisionId) => {
        const actionsDiv = document.querySelector('.actions');
        actionsDiv.style.display = 'none';

        try {
            // ** Opción 1: Generar PDF en el servidor (RECOMENDADO) **
            // Esto usa tu endpoint previo, asumiendo que el servidor maneja la plantilla HTML/Datos
            const pdfRes = await fetch(`${API_TECNICO}/informe/${revisionId}`, {
                method: "GET"
            });

            if (!pdfRes.ok) throw new Error(`Error al generar el PDF temporal: ${pdfRes.statusText}`);
            
            const blob = await pdfRes.blob();
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");

            return true;

            /* // ** Opción 2: Generar PDF en el cliente (usando html2canvas) **
            // Si el servidor solo devuelve el ID y quieres generar el PDF en el navegador.
            const canvas = await html2canvas(formContenedor, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
            pdf.save(`Reporte_Mantenimiento_${revisionId}.pdf`);
            return true; 
            */

        } catch (error) {
            console.error('Error al generar el PDF:', error);
            alert("No se pudo generar el PDF. Revisa la consola.");
            return false;
        } finally {
            // Volver a mostrar el botón de guardar
            actionsDiv.style.display = 'flex'; 
        }
    };


    /**
     * Manejador principal al enviar el formulario.
     */
    reporteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // 1. Recolectar datos del formulario y archivos a Base64
        const formData = new FormData(reporteForm);
        
        const etiquetaFile = inputEtiqueta.files[0];
        const firmaFile = inputFirma.files[0];

        const data = {
            // Campos de Datos Generales del Equipo
            cliente: formData.get("cliente"),
            marca: formData.get("marca"),
            modelo: formData.get("modelo"),
            serie: formData.get("serie"),
            tipo: formData.get("tipo_impresora"),
            garantia: formData.get("garantia") === "on", // checkbox
            fecha: formData.get("fecha"),
            consecutivo: formData.get("consecutivo"),
            
            // Campos de Revisión (usando la estructura de tu código anterior)
            equipoEnciende: valorBooleano("encendido"),
            estaOperando: valorBooleano("operando"),
            estaPartido: valorBooleano("prendido"), // Asumo 'Prendido' se refiere a si está partido
            estaManchado: valorBooleano("manchas"),

            tornillos: valorBooleano("tornillos"),
            tapas: valorBooleano("tapas"),
            display: valorBooleano("display"),
            tarjetasElectronicas: valorBooleano("tarjetas"),
            botones: valorBooleano("botones"),
            cabezal: valorBooleano("cabezal"),
            otrasPiezas: formData.get("otras_piezas"),

            oxido: valorBooleano("ejes"), // Asumo 'Ejes' como óxido/deterioro
            ruidos: valorBooleano("husillos"), // Asumo 'Husillos' como ruido
            piñoneriaEnBuenEstado: valorBooleano("pletinas"), // Asumo 'Pletinas' como piñonería
            correasEnBuenEstado: valorBooleano("cremas"), // Asumo 'Cremas' como correas
            otraMecanica: formData.get("otra_mecanica"),

            funciona: valorBooleano("funciona"),
            partida: valorBooleano("pantallaPrendida"), // Asumo 'Prendida' como partida/dañada
            lineasQuemadas: valorBooleano("lineas"),
            quemada: valorBooleano("quemada"),

            bueno: valorBooleano("cabezal_bueno"),
            lineasBlancas: valorBooleano("lineas_blancas"),
            calibrado: valorBooleano("calibrado"),
            limpio: valorBooleano("limpio"),

            buenos: valorBooleano("rodillo"), // Rodillo: Bueno
            picados: valorBooleano("ruedas"), // Ruedas: Picados
            rayados: valorBooleano("alineado"), // Alineado: Rayados
            adhesivo: valorBooleano("adecuado"), // Adecuado: Adhesivo

            humedad: valorBooleano("humedad"),
            tarjetaElectronica: valorBooleano("tarjetasOk"),
            otraElectronica: formData.get("otra_electronica"),

            observaciones: formData.get("observaciones"),
            
            // Datos de Técnico y Firma
            tecnicoUsuario: formData.get("tecnico_usuario"),
            tecnicoArea: formData.get("tecnico_area"),

            // Imágenes como Base64 (las guardas en el servidor y luego las llamas en el PDF)
            etiquetaBase64: await fileToBase64(etiquetaFile),
            firmaBase64: await fileToBase64(firmaFile),
        };
        
        console.log("Reporte Final a Enviar:", data);

        // 2. Envío al Backend
        try {
            const res = await fetch(`${API_TECNICO}/crearRevisiones`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);

            const savedRevision = await res.json();
            const revisionId = savedRevision.id; 

            // 3. Generar PDF (llamando al backend)
            const pdfSuccess = await generarPDF(revisionId);

            if (pdfSuccess) {
                alert(`✅ Revisión #${revisionId} creada y PDF generado con éxito.`);
            } else {
                alert(`⚠️ Revisión #${revisionId} creada, pero hubo un error al generar el PDF.`);
            }

            // 4. Redirigir a detalle visitas
            window.location.href = "/tecnico/detallesVisitas"; 

        } catch (error) {
            console.error("Error completo:", error);
            alert("❌ Ocurrió un error al guardar la revisión o generar el PDF. Revisa la consola para más detalles.");
        }
    });

});