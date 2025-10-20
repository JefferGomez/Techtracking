package com.devs.TechTraking.repository;


import com.devs.TechTraking.model.Equipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface EquipoRepository extends JpaRepository<Equipo, Long> {

    List<Equipo> findByClienteId(Integer clienteId);

}