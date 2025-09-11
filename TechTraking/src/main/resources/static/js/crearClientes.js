document.getElementById('registroCliente').addEventListener('submit', function(e) {
  e.preventDefault(); // Evita recargar la página al enviar el formulario

  // Capturar valores del formulario
  const nombre = document.getElementById('empresa').value.trim();
  const id = document.getElementById('nit').value.trim();
  const direccion = document.getElementById('direccion').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const email = document.getElementById('email').value.trim();


  // Crear el objeto que se va a enviar como JSON
  const cliente = {
    nombre: nombre,
    id: id,
    direccion: direccion,
    telefono: telefono,
    correo: email
  };

  // Enviar los datos al backend (Spring Boot)
  fetch('http://localhost:8080/admin/crearCliente', {
    method: 'POST',
    headers: {
      'Accept':'application/json',
      'Content-Type':'application/json'
    },
    body: JSON.stringify(cliente)
  })
  .then(response => {
    if (response.ok) {
      return response.json(); // Si todo salió bien, obtenemos la respuesta como JSON
    } else {
      throw new Error('Error al registrar el cliente');
    }
  })
  .then(data => {
    console.log('Cliente registrado exitosamente:', data);
    alert('Cliente registrado con éxito');
    // Puedes limpiar el formulario si deseas:
    document.getElementById('registroCliente').reset();
  })
  .catch(error => {
    console.error('Error al registrar:', error);
    alert('Hubo un problema al registrar el cliente');
  });
});
