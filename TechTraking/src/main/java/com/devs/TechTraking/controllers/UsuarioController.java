package com.devs.TechTraking.controllers;
import com.devs.TechTraking.model.Usuarios;
import com.devs.TechTraking.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;




@RestController
@RequestMapping("/Usuarios")
public class UsuarioController {

    @Autowired
    UsuarioRepository repository;



    @GetMapping("/verUsuarios")
    public List<Usuarios> obtenerUsuarios(){

        return repository.findAll();

    }

    @PostMapping("/crearUsuarios")
    public void guardarUsuario(@RequestBody Usuarios usuario){

        repository.save(usuario);

    }


}
