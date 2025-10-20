package com.devs.TechTraking.controllers;

import com.devs.TechTraking.model.Cliente;
import com.devs.TechTraking.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/clientes")
public class ClienteRestController {

    @Autowired
    private ClienteRepository clienteRepository;

    @GetMapping("/buscar")
    public Cliente buscarCliente(@RequestParam("query") String query) {
        try {
            // Si el query es un número, intenta buscar por ID
            try {
                Long id = Long.parseLong(query);
                return clienteRepository.findById(id).orElse(null);
            } catch (NumberFormatException e) {
                // Si no es número, busca por nombre
                return clienteRepository.findByNombreContainingIgnoreCase(query);
            }
        } catch (Exception e) {
            e.printStackTrace(); // Útil para depurar en consola
            return null;
        }
    }
}
