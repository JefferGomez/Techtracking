document.getElementById('registroCliente').addEventListener('submit', function(e) { // Escucha cuando se envía el formulario con id "registroCliente"
  e.preventDefault(); // Previene que el formulario se envíe de forma tradicional (evita recargar la página)

  // A continuación, se obtiene el valor de cada campo del formulario y se le quitan los espacios extra
  const empresa = document.getElementById('empresa').value.trim(); // Obtiene el nombre de la empresa
  const nit = document.getElementById('nit').value.trim(); // Obtiene el NIT
  const direccion = document.getElementById('direccion').value.trim(); // Obtiene la dirección
  const ciudad = document.getElementById('ciudad').value.trim(); // Obtiene la ciudad
  const telefono = document.getElementById('telefono').value.trim(); // Obtiene el teléfono
  const email = document.getElementById('email').value.trim(); // Obtiene el correo electrónico
  const tipo = document.getElementById('tipoCliente').value; // Obtiene el tipo de cliente (Natural o Jurídico)
  const terminos = document.getElementById('terminos').checked; // Verifica si el usuario marcó el checkbox de términos

  // Verifica si alguno de los campos está vacío o si no se aceptaron los términos
  if (!empresa || !nit || !direccion || !ciudad || !telefono || !email || !tipo || !terminos) {
    alert('Por favor, complete todos los campos obligatorios y acepte los términos.'); // Muestra una alerta si falta algo
    return; // Sale de la función sin hacer nada más
  }

  alert('Cliente registrado exitosamente.'); // Muestra mensaje de éxito si todo está correcto
});

document.getElementById("avatar").addEventListener("change", function () { // Escucha cuando se selecciona una imagen
  const file = this.files[0]; // Toma el primer archivo seleccionado por el usuario
  if (file) { // Si hay un archivo...
    const reader = new FileReader(); // Crea un lector de archivos
    reader.onload = function (e) { // Cuando el archivo esté cargado...
      const preview = document.getElementById("preview"); // Selecciona la imagen donde se mostrará la vista previa
      preview.src = e.target.result; // Coloca la imagen cargada como fuente (src) de la imagen
      preview.style.display = "block"; // Hace visible la imagen (por defecto estaba oculta)
    };
    reader.readAsDataURL(file); // Lee el archivo y lo convierte en una URL de datos (base64)
  }
});
