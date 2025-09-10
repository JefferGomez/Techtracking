package com.devs.TechTraking.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Controller

public class Clicontroller {

    @GetMapping("/admin/crearclientes")
    public String datosCliente(){
        return "registroClientes";
    }


}
