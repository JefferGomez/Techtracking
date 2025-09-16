package com.devs.TechTraking.controllers;


import com.devs.TechTraking.model.Tecnico;
import com.devs.TechTraking.model.Visita;
import com.devs.TechTraking.service.CronogramaService;
import com.devs.TechTraking.service.TecnicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tecnico")
public class CronogramaRestController {

    @Autowired
    private CronogramaService cronogramaService;
    @Autowired
    private TecnicoService tecnicoService;

    @GetMapping("/visitasTecnico")
    public Map<LocalDate,Long> obtenerVisitas30Dias(Authentication authentication){
        String correo = authentication.getName();

        Tecnico tecnico = tecnicoService.obtenerPorCorreo(correo);

        return cronogramaService.obtenerResumen30Dias(tecnico);
    }

    @GetMapping("/visitasDia")
    public List<Visita> obtenerVisitasDia(Authentication authentication,
                                              @RequestParam("fecha")@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha
    ){
        String correo = authentication.getName();
        Tecnico tecnico = tecnicoService.obtenerPorCorreo(correo);

        return cronogramaService.obtenerDetallePorDia(tecnico,fecha);
    }







}
