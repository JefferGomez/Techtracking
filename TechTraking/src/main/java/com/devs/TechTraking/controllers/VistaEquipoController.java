package com.devs.TechTraking.controllers;

import com.devs.TechTraking.model.Cliente;
import com.devs.TechTraking.model.Equipo;
import com.devs.TechTraking.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/vistaequipo")
public class VistaEquipoController {

    @Autowired
    private ClienteRepository clienteRepository;

    @GetMapping("/{id}")
    public Map<String, Object> obtenerVistaEquipo(@PathVariable Long id) {
        Cliente cliente = clienteRepository.findById(id).orElse(null);

        Map<String, Object> response = new HashMap<>();

        if (cliente == null) {
            response.put("error", "Cliente no encontrado");
            return response;
        }

        Equipo equipo = (cliente.getEquipos() != null && !cliente.getEquipos().isEmpty())
                ? cliente.getEquipos().get(0)
                : null;

        response.put("cliente", cliente);
        response.put("equipo", equipo);

        return response;
    }

}

