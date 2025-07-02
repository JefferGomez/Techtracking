package com.devs.TechTraking.service;

import com.devs.TechTraking.model.Cliente;
import com.devs.TechTraking.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public Cliente guardar(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    public List<Cliente> listartodos() {
        return clienteRepository.findAll();
    }
}

