package com.devs.TechTraking.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class ListaClientes {

    @GetMapping("/clientes")
    public String datosCliente(){
        return "dashboard-clientes";
    }
}
