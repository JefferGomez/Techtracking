package com.devs.TechTraking.repository;


import com.devs.TechTraking.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {}