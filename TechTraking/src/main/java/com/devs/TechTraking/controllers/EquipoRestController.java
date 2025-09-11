package com.devs.TechTraking.controllers;

import com.devs.TechTraking.DTO.EquipoDTO;
import com.devs.TechTraking.model.Cliente;
import com.devs.TechTraking.model.Equipo;
import com.devs.TechTraking.repository.ClienteRepository;
import com.devs.TechTraking.repository.EquipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/equipos")
public class EquipoRestController {

    @Autowired
    private EquipoRepository equipoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @PostMapping
    public Equipo crearEquipo(@RequestBody EquipoDTO equipoDTO) {
        Cliente cliente = clienteRepository.findById(equipoDTO.getClienteId()).orElse(null);
        if (cliente == null) {
            throw new RuntimeException("Cliente no encontrado");
        }

        Equipo equipo = new Equipo();
        equipo.setId(equipoDTO.getId()); // ✅ ID manual
        equipo.setMarca(equipoDTO.getMarca());
        equipo.setModelo(equipoDTO.getModelo());
        equipo.setSerie(equipoDTO.getSerie());
        equipo.setTipo(equipoDTO.getTipo());
        equipo.setCliente(cliente);

        return equipoRepository.save(equipo);
    }

}

