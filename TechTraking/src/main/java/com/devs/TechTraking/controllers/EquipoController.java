package com.devs.TechTraking.controllers;


import com.devs.TechTraking.model.Equipo;
import com.devs.TechTraking.service.EquipoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin")

public class EquipoController {

    @Autowired
    public EquipoService equipoService;

    @PostMapping("/crearequipo")
    public ResponseEntity<Equipo> crearEquipo(@RequestBody Equipo equipo){
        return ResponseEntity.ok(equipoService.guardar(equipo));

    }

    @GetMapping("/mostrarequipos")
    public List<Equipo> listarEquipos(){
        return equipoService.listartodos();
    }
}
