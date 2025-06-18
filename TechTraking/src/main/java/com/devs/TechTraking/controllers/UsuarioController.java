package com.devs.TechTraking.controllers;
import com.devs.TechTraking.model.Usuarios;
import com.devs.TechTraking.repository.UsuarioRepository;
import com.devs.TechTraking.service.UsuariosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;




@RestController
@RequestMapping("/Usuarios")
public class UsuarioController {

    @Autowired
    UsuariosService usuariosService;



    @GetMapping("/verUsuarios")
    public List<Usuarios> obtenerUsuarios(){

        return usuariosService.obtenerUsuarios();

    }

    @PostMapping("/crearUsuarios")
    public ResponseEntity<Usuarios> guardarUsuario(@RequestBody Usuarios usuario){

        Usuarios nuevoUsuario=usuariosService.crearUsuarios(usuario);
        return ResponseEntity.ok(nuevoUsuario);

    }


}
