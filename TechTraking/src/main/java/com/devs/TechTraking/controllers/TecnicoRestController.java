package com.devs.TechTraking.controllers;

import com.devs.TechTraking.model.Tecnico;
import com.devs.TechTraking.repository.TecnicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
