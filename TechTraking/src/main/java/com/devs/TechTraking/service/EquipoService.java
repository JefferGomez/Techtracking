package com.devs.TechTraking.service;


import com.devs.TechTraking.model.Cliente;
import com.devs.TechTraking.model.Equipo;
import com.devs.TechTraking.repository.ClienteRepository;
import com.devs.TechTraking.repository.EquipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipoService {

    @Autowired
    private EquipoRepository equipoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    public Equipo guardar(Equipo equipo) {
        if (equipo.getCliente() == null || equipo.getCliente().getId() == 0) {
            throw new IllegalArgumentException("El equipo debe incluir un cliente con un ID válido.");
        }

        long clienteId = equipo.getCliente().getId();
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new IllegalArgumentException("El cliente con ID " + clienteId + " no existe."));

        equipo.setCliente(cliente);
        return equipoRepository.save(equipo);
    }


    public List<Equipo> listartodos() {
        return equipoRepository.findAll();
    }


    public List<Equipo> obtenerEquiposPorCliente(Integer clienteId) {
        return equipoRepository.findByClienteId(clienteId);
    }
}

