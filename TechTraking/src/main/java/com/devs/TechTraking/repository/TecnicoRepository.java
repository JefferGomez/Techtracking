package com.devs.TechTraking.repository;

import com.devs.TechTraking.model.Tecnico;
import com.devs.TechTraking.model.Usuarios;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TecnicoRepository extends JpaRepository <Tecnico,Integer> {

    Optional<Tecnico> findByUsuarioCorreo(String correo);

}
