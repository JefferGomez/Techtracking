package com.devs.TechTraking.controllers;


import com.devs.TechTraking.model.Equipo;
import com.devs.TechTraking.repository.EquipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/tecnico")
public class FormularioController {

    @Autowired
    private EquipoRepository equipoRepository;

    @GetMapping("/formulario/{equipoId}")
    public String obtenerFormulario(@PathVariable Long equipoId, Model model){

        Equipo equipo = equipoRepository.findById(equipoId)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));

        model.addAttribute("equipoId", equipo.getId());
        model.addAttribute("marca", equipo.getMarca());
        model.addAttribute("modelo", equipo.getModelo());
        model.addAttribute("cliente", equipo.getCliente().getNombre());
        model.addAttribute("clienteId", equipo.getCliente().getId());

        return "Formulario";
    }

}
