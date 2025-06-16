


let boton = document.getElementById("registrar")

boton.addEventListener("click",evento =>{

    registrarUsuario();

})



let registrarUsuario = async()=>{

    let campos = {}

    campos.nombre=document.getElementById("NombreC").value
    campos.id = document.getElementById("Id").value
    campos.correo = document.getElementById("correo").value
    campos.password = document.getElementById("password").value
    campos.rol = { id: parseInt(document.getElementById("rol").value) };

    const peticion = await fetch("http://localhost:8080/Usuarios/crearUsuarios",
        {

            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify(campos)

        })
}