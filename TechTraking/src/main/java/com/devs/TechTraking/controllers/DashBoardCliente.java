package com.devs.TechTraking.controllers;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class DashBoardCliente {

    @GetMapping("/admin")
    public String dascliente(){
        return "dashboard-clientes";
    }
}
