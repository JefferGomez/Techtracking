package com.devs.TechTraking.controllers;

import com.devs.TechTraking.model.Cliente;
import com.devs.TechTraking.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/vistaequipo")
public class VistaEquipoController {

    @Autowired
    private ClienteRepository clienteRepository;

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerVistaEquipo(@PathVariable Long id) {
        return clienteRepository.findById(id)
                .map(cliente -> ResponseEntity.ok(cliente))
                .orElse(ResponseEntity.notFound().build());
    }
}
