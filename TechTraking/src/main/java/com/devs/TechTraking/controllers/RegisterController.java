package com.devs.TechTraking.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequestMapping("/superadmin")
public class RegisterController {

    @GetMapping("/register")
    public String mostrarInicio() {
        return "registerUsuarios";
    }

}
