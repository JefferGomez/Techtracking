package com.devs.TechTraking.controllers;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller

public class vincularcontroller {

    @GetMapping("/admin/crearequipo")
    public String vincular(){
        return "vincularequipo";
    }
}
