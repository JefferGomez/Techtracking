package com.devs.TechTraking.controllers;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;


@Controller
public class IntentosFallidos {

    @RequestMapping(value = "/auth/intentosFallidos", method = {RequestMethod.GET, RequestMethod.POST})
    public String intentos(){

        return "intentosfallidos";

    }

}
