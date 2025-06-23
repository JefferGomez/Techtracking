package com.devs.TechTraking.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class RedireccionarController {

    @GetMapping("/redireccionar")
    public String redirigirPorRol(Authentication authentication) {
        String rol = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                 .findFirst()
                 .orElse("");

        return switch (rol) {
            case "SUPERADMIN" -> "redirect:/superadmin";
            case "ADMIN" -> "redirect:/admin";
            case "TECNICO" -> "redirect:/tecnico";
            case "ALMACENISTA" -> "redirect:/almacenista";
            default -> "redirect:/";
        };
    }


}
