package com.devs.TechTraking.repository;

import com.devs.TechTraking.model.Tecnico;
import com.devs.TechTraking.model.Visita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface VisitaRepository extends JpaRepository <Visita,Integer> {

    @Query("SELECT DISTINCT v FROM Visita v " +
            "LEFT JOIN FETCH v.cliente c " +
            "LEFT JOIN FETCH v.tecnico t " +
            "LEFT JOIN FETCH t.usuario u " +
            "LEFT JOIN FETCH v.equipos e " +
            "WHERE v.fecha BETWEEN :inicio AND :fin")
    List<Visita> findByFechaBetween(LocalDate inicio, LocalDate fin);
    List<Visita> findByTecnicoAndFechaBetween(Tecnico tecnico, LocalDate inicio, LocalDate fin);
    List<Visita> findByTecnicoAndFecha(Tecnico tecnico, LocalDate fecha);
    @Query("SELECT v FROM Visita v " +
            "JOIN FETCH v.cliente c " +
            "JOIN FETCH v.tecnico t " +
            "JOIN FETCH t.usuario u " +
            "JOIN FETCH v.equipos e " +
            "WHERE v.id = :id")
    Optional<Visita> findVisitaCompleta(@Param("id") Integer id);

}
