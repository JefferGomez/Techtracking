package com.devs.TechTraking.controllers;

import com.devs.TechTraking.enums.EstadoVisita;
import com.devs.TechTraking.model.Tecnico;
import com.devs.TechTraking.model.Visita;
import com.devs.TechTraking.repository.TecnicoRepository;
import com.devs.TechTraking.service.VisitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class TecnicoRestController {

    @Autowired
    TecnicoRepository tecnicoRepository;

    @GetMapping("/tecnicos")
    public List<Tecnico> mostrarTecnicos(){
        return tecnicoRepository.findAll();
    }



}
