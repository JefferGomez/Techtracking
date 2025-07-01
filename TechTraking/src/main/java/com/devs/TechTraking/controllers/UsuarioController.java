package com.devs.TechTraking.controllers;
import com.devs.TechTraking.model.Usuarios;
import com.devs.TechTraking.repository.UsuarioRepository;
import com.devs.TechTraking.service.UsuariosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/superadmin")
public class UsuarioController {

    @Autowired
    UsuariosService usuariosService;



    @GetMapping("/mostrarUsuarios")
    public List<Usuarios> obtenerUsuarios(){

        return usuariosService.obtenerUsuarios();

    }

    @PostMapping("/crearUsuarios")
    public ResponseEntity<Usuarios> guardarUsuario(@RequestBody Usuarios usuario){

        Usuarios nuevoUsuario=usuariosService.crearUsuarios(usuario);
        return ResponseEntity.ok(nuevoUsuario);


    }

    @PutMapping("/editarUsuario/{id}")
    public ResponseEntity<?> editarUsuario(@PathVariable Integer id, @RequestBody Usuarios datosActualizados) {
        Optional<Usuarios> usuarioEditado = usuariosService.editarUsuario(id, datosActualizados);

        if (usuarioEditado.isPresent()) {
            return ResponseEntity.ok("Usuario actualizado correctamente");
        } else {
            return ResponseEntity.status(404).body("Usuario no encontrado");
        }
    }

    @DeleteMapping("eliminarUsuario/{id}")
        public ResponseEntity<?> eliminarUsuario(@PathVariable Integer id){

        boolean eliminado = usuariosService.eliminarUsuario(id);

        if (eliminado){

            return ResponseEntity.ok("Usuario eliminado correctamente");


        }else {

            return ResponseEntity.status(404).body("Usuario no Encontrado");

        }

    }


}
