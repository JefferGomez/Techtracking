


let boton = document.getElementById("registrar")
let rolSelect = document.getElementById("rol");
let tecnicoFields = document.getElementById("tecnicoFields");

rolSelect.addEventListener("change", () => {
    if (rolSelect.value === "3") {
        tecnicoFields.style.display = "block";
    } else {
        tecnicoFields.style.display = "none";
    }
});

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

     if (campos.rol.id === 3) {
        campos.tecnico = {
          especialidad: document.getElementById("especialidad").value,
          telefono: document.getElementById("telefono").value
        };
      }


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