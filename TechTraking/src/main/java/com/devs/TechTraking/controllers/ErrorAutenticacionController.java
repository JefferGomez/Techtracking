package com.devs.TechTraking.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class ErrorAutenticacionController {

    @RequestMapping(value = "/auth/errorAutenticacion", method = {RequestMethod.GET, RequestMethod.POST})
    public String mostrarError(){
        return "errorAutenticacion";
    }


}
