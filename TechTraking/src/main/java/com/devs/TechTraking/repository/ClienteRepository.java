package com.devs.TechTraking.repository;

import com.devs.TechTraking.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Cliente findByNombreContainingIgnoreCase(String nombre);
}
