  let UsuariosTotales = []
  let currentPage = 1;
  const pageSize = 10; // items per page - adjust as needed



    fetch("http://localhost:8080/superadmin/mostrarUsuarios")
      .then(response => response.json())
      .then(data => {
        UsuariosTotales = data
        renderTable(data)
        document.getElementById("totalUsers").textContent = data.length;

      })
      .catch(error => console.error('Error al traer los datos:', error));

    function renderTable(data) {
      const tbody = document.getElementById("userBody");
      tbody.innerHTML = "";

      // Calculate page slice
      const start = (currentPage - 1) * pageSize;
      const pageData = data.slice(start, start + pageSize);

      pageData.forEach(user => {
        const tr = document.createElement("tr");

        const opciones = user.rol.nombre.toLowerCase() !== 'superadmin'
          ? `
            <div class="dropdown">
              <button class="dropdown-toggle" onclick="toggleDropdown(this)">⋮</button>
              <div class="dropdown-menu">
                <a href="#" onclick="editarUsuario(${user.id},'${user.correo}')">Editar</a>
                <a href="#" onclick="confirmDelete(${user.id})">Eliminar</a>
              </div>
            </div>
          `
          : '';

        tr.innerHTML = `
          <td>${user.nombre}</td>
          <td>${user.correo}</td>
          <td>${user.rol.nombre}</td>
          <td>${user.id}</td>
          <td>${opciones}</td>
        `;

        tbody.appendChild(tr);
      });

      renderPagination(data);
    }
    function renderPagination(dataArray) {
      const totalItems = dataArray.length;
      const totalPages = Math.ceil(totalItems / pageSize) || 1;
      const container = document.getElementById('pagination');
      if (!container) return;
      container.innerHTML = '';

      const prev = document.createElement('button');
      prev.textContent = 'Anterior';
      prev.disabled = currentPage === 1;
      prev.onclick = () => { if (currentPage>1) currentPage--; renderTable(dataArray); };
      container.appendChild(prev);

      // simple page numbers
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        if (i === currentPage) btn.classList.add('active-page');
        btn.onclick = () => { currentPage = i; renderTable(dataArray); };
        container.appendChild(btn);
      }

      const next = document.createElement('button');
      next.textContent = 'Siguiente';
      next.disabled = currentPage === totalPages;
      next.onclick = () => { if (currentPage<totalPages) currentPage++; renderTable(dataArray); };
      container.appendChild(next);
    }



    


    document.addEventListener('click', function(e) {
      const isDropdownBtn = e.target.matches(".dropdown-toggle");

      document.querySelectorAll(".dropdown-menu").forEach(menu => {
        if (!menu.contains(e.target)) menu.style.display = "none";
      });

      if (isDropdownBtn) {
        const menu = e.target.nextElementSibling;
        menu.style.display = (menu.style.display === "block") ? "none" : "block";
      }
    });


    document.getElementById("search").addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();

      const usuariosFiltrados = UsuariosTotales.filter(user =>
        user.nombre.toLowerCase().includes(searchTerm) ||
        user.correo.toLowerCase().includes(searchTerm) ||
        user.id.toString().includes(searchTerm)
      );

      currentPage = 1;
      renderTable(usuariosFiltrados);
    });



    let usuarioEditandoId = null;

    function editarUsuario(id, correoActual) {
      usuarioEditandoId = id;
      document.getElementById("editarCorreo").value = correoActual;
      document.getElementById("editarPassword").value = "";
      document.getElementById("infoUsuario").textContent = `Editando usuario con ID: ${id}`;
      document.getElementById("modalEditar").style.display = "flex";
    }

    function cerrarModalEditar() {
      document.getElementById("modalEditar").style.display = "none";
    }

    // Enviar datos al backend
    document.getElementById("formEditar").addEventListener("submit", async function(e) {
      e.preventDefault();

      const nuevoCorreo = document.getElementById("editarCorreo").value;
      const nuevaPassword = document.getElementById("editarPassword").value;

      const data = {
        correo: nuevoCorreo,
        contraseña: nuevaPassword
      };

      try {
        const response = await fetch(`http://localhost:8080/superadmin/editarUsuario/${usuarioEditandoId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          alert("Usuario actualizado correctamente");
          cerrarModalEditar();
          location.reload(); // o vuelve a cargar la tabla
        } else {
          alert("Error al actualizar usuario");
        }
      } catch (error) {
        console.error("Error al enviar:", error);
        alert("Error inesperado");
      }
    });




/*let boton = document.getElementById("registrar")

boton.addEventListener("click",evento =>{


    evento.preventDefault();
    registrarUsuario();

})



let registrarUsuario = async()=>{

   const password = document.getElementById("password").value;
  const confirmPassword = document.querySelector("[name='confirmPassword']").value;

  if (password !== confirmPassword) {
    alert("Las contraseñas no coinciden.");
    return;
  }


    let campos = {}

    campos.nombre=document.getElementById("NombreC").value
    campos.id = document.getElementById("Id").value
    campos.correo = document.getElementById("correo").value
    campos.contraseña = password
    campos.rol = { id: parseInt(document.getElementById("rol").value) };

    const peticion = await fetch("http://localhost:8080/superadmin/crearUsuarios",
        {

            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify(campos)

        })

        .then(response => {
            if (response.ok){
                window.location.href = "/superadmin/Usuarios"
                } else{
                        alert("Error Al Registrar Usuario")
                }

        })
    }
*/
function confirmDelete(id) {
  if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;

  fetch(`http://localhost:8080/superadmin/eliminarUsuario/${id}`, {
    method: "DELETE"
  })
  .then(res => {
    if (res.ok) {
      alert("Usuario eliminado correctamente");
      location.reload();
    } else {
      alert("Error al eliminar el usuario");
    }
  })
  .catch(err => {
    console.error("Error al eliminar:", err);
    alert("Error inesperado");
  });
}

function cargarChat() {
  const cont = document.getElementById("contenido");
  cont.innerHTML = `
    <h2>Chat</h2>
    <iframe src="chat.html" style="width:100%;height:500px;border:none;"></iframe>
  `;
}


