package com.devs.TechTraking.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class errorAutenticacionController {

    @GetMapping("/errorAutenticacion")
    public String mostrarError(){
        return "errorAutenticacion";
    }


}
