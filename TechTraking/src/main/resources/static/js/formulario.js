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
