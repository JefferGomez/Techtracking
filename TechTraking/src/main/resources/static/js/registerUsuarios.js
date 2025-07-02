


let boton = document.getElementById("registrar")

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