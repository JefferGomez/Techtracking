package com.devs.TechTraking.controllers;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
public class AgendarVisitasController {

    @GetMapping("/Visitas")
     public String calendario(){
         return "agendarVisitas";
     }
}
