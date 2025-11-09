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


// Función para convertir "SI"/"NO" a boolean
const valorBooleano = (name) => {
  const val = document.querySelector(`input[name="${name}"]:checked`);
  return val ? val.value === "SI" : false;
};

// Vista previa de imágenes (opcional)
function mostrarVistaPrevia(input, previewId) {
  const file = input.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById(previewId).src = e.target.result;
      document.getElementById(previewId).style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    document.getElementById(previewId).style.display = "none";
  }
}

document.querySelector("input[name='etiqueta']").addEventListener("change", function () {
  mostrarVistaPrevia(this, "previewEtiqueta");
});

document.querySelector("input[name='firma']").addEventListener("change", function () {
  mostrarVistaPrevia(this, "previewFirma");
});

// Envío del formulario al backend
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = {
    clienteId: parseInt(document.querySelector('input[name="clienteId"]').value),
    equipoId: parseInt(document.querySelector('input[name="serie"]').value),

    equipoEnciende: valorBooleano("encendido"),
    estaOperando: valorBooleano("operando"),
    estaPartido: valorBooleano("prendido"),
    estaManchado: valorBooleano("manchas"),

    tornillos: valorBooleano("tornillos"),
    tapas: valorBooleano("tapas"),
    display: valorBooleano("display"),
    tarjetasElectronicas: valorBooleano("tarjetas"),
    botones: valorBooleano("botones"),
    cabezal: valorBooleano("cabezal"),

    oxido: valorBooleano("ejes"),
    ruidos: valorBooleano("husillos"),
    piñoneriaEnBuenEstado: valorBooleano("pletinas"),
    correasEnBuenEstado: valorBooleano("cremas"),

    funciona: valorBooleano("funciona"),
    partida: valorBooleano("pantallaPrendida"),
    lineasQuemadas: valorBooleano("lineas"),
    quemada: valorBooleano("quemada"),

    bueno: valorBooleano("cabezal_bueno"),
    lineasBlancas: valorBooleano("lineas_blancas"),
    calibrado: valorBooleano("calibrado"),
    limpio: valorBooleano("limpio"),

    buenos: valorBooleano("rodillo"),
    picados: valorBooleano("ruedas"),
    rayados: valorBooleano("alineado"),
    adhesivo: valorBooleano("adecuado"),

    humedad: valorBooleano("humedad"),
    tarjetaElectronica: valorBooleano("tarjetasOk"),

    observaciones: document.querySelector("textarea").value,
    fecha: document.querySelector('input[name="fecha"]').value
  };

  console.log("Revision JSON:", data);


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
