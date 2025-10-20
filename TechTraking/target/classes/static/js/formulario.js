const form = document.querySelector("form");

// ✅ Guardar y generar PDF
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  alert("✅ Generando PDF con la información...");

  // Capturar el contenedor
  const contenedor = document.querySelector(".container");

  // Convertir a canvas
  const canvas = await html2canvas(contenedor, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  // Crear PDF en formato A4
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  // Ajustar la imagen al ancho del PDF
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

  // Descargar
  pdf.save("Reporte_Servimarket.pdf");
});

// ✅ Vista previa imágenes (Etiqueta y Firma)
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
<<<<<<< Updated upstream
=======

// Envío del formulario al backend
form.addEventListener("submit", async function (e) {
  e.preventDefault();

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
>>>>>>> Stashed changes
