package com.devs.TechTraking.service;

import com.devs.TechTraking.model.Tecnico;
import com.devs.TechTraking.repository.TecnicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class TecnicoService {

    @Autowired
    private TecnicoRepository tecnicoRepository;

    public Tecnico obtenerPorCorreo(String correo){
        return tecnicoRepository.findByUsuarioCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Tecnico no encontrado"));
    }

}
