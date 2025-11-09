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

            const data = {
                // IDs (si existen)
                equipoId: parseInt(formData.get("equipoId")),
                clienteId: parseInt(formData.get("clienteId")),


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


  try {
    const res = await fetch("http://localhost:8080/tecnico/crearRevisiones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error("Error al crear revision");

    const savedRevision = await res.json();
    const revisionId = savedRevision.id; // <-- ID autoincremental generado
const pdfRes = await fetch(`http://localhost:8080/tecnico/informe/${revisionId}`, {
      method: "GET"
    });

    if (!pdfRes.ok) throw new Error("Error al generar el PDF temporal");
    
    const blob = await pdfRes.blob();
    const url = URL.createObjectURL(blob);

    // 3️⃣ Abrir PDF en nueva pestaña para probar
    window.open(url, "_blank");

    alert("✅ Revisión creada y PDF generado temporalmente. Puedes ver el PDF en la nueva pestaña.");

    // 4️⃣ Redirigir a detalle visitas
    window.location.href = "/tecnico/detallesVisitas";

  } catch (error) {
    console.error(error);
    alert("❌ Ocurrió un error al guardar la revisión o generar el PDF.");
  }
});
