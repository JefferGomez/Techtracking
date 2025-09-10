document.getElementById('registroCliente').addEventListener('submit', function(e) { // Escucha cuando se envía el formulario con id "registroCliente"
  e.preventDefault(); // Previene que el formulario se envíe de forma tradicional (evita recargar la página)

  // A continuación, se obtiene el valor de cada campo del formulario y se le quitan los espacios extra
  const empresa = document.getElementById('empresa').value.trim(); // Obtiene el nombre de la empresa
  const nit = document.getElementById('nit').value.trim(); // Obtiene el NIT
  const direccion = document.getElementById('direccion').value.trim(); // Obtiene la dirección
  const telefono = document.getElementById('telefono').value.trim(); // Obtiene el teléfono
  const email = document.getElementById('email').value.trim(); // Obtiene el correo electrónico
  const terminos = document.getElementById('terminos').checked; // Verifica si el usuario marcó el checkbox de términos

  // Verifica si alguno de los campos está vacío o si no se aceptaron los términos
  if (!empresa || !nit || !direccion || !telefono || !email || !terminos) {
    alert('Por favor, complete todos los campos obligatorios y acepte los términos.'); // Muestra una alerta si falta algo
    return; // Sale de la función sin hacer nada más
  }

  const datosCliente = { empresa, nit, direccion, telefono, email };

  fetch('http://localhost:8080/admin/crearCliente', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datosCliente)
  })
  .then(response => response.json())
  .then(data => {
    alert(data.mensaje);
    document.getElementById('registroCliente').reset(); // Limpia el formulario
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Hubo un error al registrar el cliente.');
  });
});
