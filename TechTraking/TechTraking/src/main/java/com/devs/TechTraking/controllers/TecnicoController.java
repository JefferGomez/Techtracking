package com.devs.TechTraking.controllers;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class TecnicoController {

    @GetMapping("/tecnico")
    public  String tecnicoDash(){
        return "DashBoardTecnico";
    }

}
