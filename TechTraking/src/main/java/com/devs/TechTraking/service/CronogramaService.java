package com.devs.TechTraking.service;


import com.devs.TechTraking.model.Tecnico;
import com.devs.TechTraking.model.Visita;
import com.devs.TechTraking.repository.VisitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
public class CronogramaService {

    @Autowired
    private VisitaRepository visitaRepository;


    public Map<LocalDate,Long>obtenerResumen30Dias(Tecnico tecnico){
        LocalDate hoy = LocalDate.now();
        LocalDate rango = LocalDate.now().plusDays(30);

        List<Visita> visitas = visitaRepository.findByTecnicoAndFechaBetween(tecnico,hoy,rango);


        Map<LocalDate,Long> resumen = visitas.stream()
                .collect(Collectors.groupingBy(Visita::getFecha, TreeMap::new, Collectors.counting()));


        return resumen;
    }

    public List<Visita> obtenerDetallePorDia(Tecnico tecnico, LocalDate fecha) {
        return visitaRepository.findByTecnicoAndFecha(
                tecnico,
                fecha
        );
    }



}
