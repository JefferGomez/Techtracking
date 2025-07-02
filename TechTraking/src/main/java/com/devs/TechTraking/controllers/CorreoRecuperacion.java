package com.devs.TechTraking.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/auth")
public class CorreoRecuperacion {

    @GetMapping("/CorreoRecuperar")
    public String CorreoRecuperar() {
        return "CorreoRecuperacion";
    }

}
