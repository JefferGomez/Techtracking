package com.devs.TechTraking.controllers;

import com.devs.TechTraking.model.Cliente;
import com.devs.TechTraking.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/clientes")
public class ClienteRestController {

    @Autowired
    private ClienteRepository clienteRepository;

    @GetMapping("/buscar")
    public ResponseEntity<Cliente> buscarCliente(@RequestParam("query") String query) {
        try {
            Cliente cliente;

            try {
                Long id = Long.parseLong(query);
                cliente = clienteRepository.findById(id).orElse(null);
            } catch (NumberFormatException e) {
                cliente = clienteRepository.findByNombreContainingIgnoreCase(query);
            }

            if (cliente != null) {
                return ResponseEntity.ok(cliente);        // ✅ JSON con 200 OK
            } else {
                return ResponseEntity.notFound().build(); // ✅ 404 sin HTML
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();    // ✅ Error 500 controlado
        }
    }

}
