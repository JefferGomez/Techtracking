package com.devs.TechTraking.controllers;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller

public class registrocontroller {

    @GetMapping("/admin/crearCliente")
    public String regcont(){
        return "registroClientes";
    }
}
