package com.devs.TechTraking.repository;


import com.devs.TechTraking.model.Equipo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EquipoRepository extends JpaRepository<Equipo, Long> {

    List<Equipo> findByClienteId(Integer clienteId);
}