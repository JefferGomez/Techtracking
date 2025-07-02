package com.devs.TechTraking.controllers;


import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
public class cambiarContraseñaController {

    @GetMapping("/auth/cambiarContrasena")
    public String cambioContraseña(@RequestParam("token") String token, Model model) {
        model.addAttribute("token", token);
        System.out.println("Token recibido: " + token);
        return "cambiarContraseña";
    }

}
