package com.devs.TechTraking.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class VistaController {

    @GetMapping("/admin/vistaequipo")
    public String vista() {
        return "vistaequipo";
    }
}
