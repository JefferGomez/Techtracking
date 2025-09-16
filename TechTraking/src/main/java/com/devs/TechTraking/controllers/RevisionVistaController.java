package com.devs.TechTraking.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller

public class RevisionVistaController {

    @GetMapping("/admin/formulario")
    public String datosCliente(){
        return "revisionFormulario";
    }

}
