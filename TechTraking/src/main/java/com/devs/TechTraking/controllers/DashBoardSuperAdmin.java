package com.devs.TechTraking.controllers;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class DashBoardSuperAdmin {


    @GetMapping("/superadmin/Usuarios")
    private String listarUsuarios(){

        return "dashboardAdmin";

    }

}
