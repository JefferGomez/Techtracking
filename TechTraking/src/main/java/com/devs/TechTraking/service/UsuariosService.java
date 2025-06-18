package com.devs.TechTraking.service;

import com.devs.TechTraking.model.Usuarios;
import com.devs.TechTraking.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UsuariosService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuarios> obtenerUsuarios(){

        return usuarioRepository.findAll();

    }

    public Usuarios crearUsuarios(Usuarios usuarios){

        return usuarioRepository.save(usuarios);

    }


}
