package com.devs.TechTraking.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Controller

public class Eqcontroller {

    @GetMapping("/crearequipo")
    public String datosCliente(){
        return "registroEquipo";
    }


}
