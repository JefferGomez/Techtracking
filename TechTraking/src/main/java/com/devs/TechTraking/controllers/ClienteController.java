package com.devs.TechTraking.controllers;


import com.devs.TechTraking.model.Cliente;
import com.devs.TechTraking.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @PostMapping("/crearCliente")
    public ResponseEntity<Cliente> crearCliente(@RequestBody Cliente cliente) {
        return ResponseEntity.ok(clienteService.guardar(cliente));
    }

    @GetMapping("/mostrarClientes")
    public List<Cliente> listar() {
        return clienteService.listartodos();
    }

}

