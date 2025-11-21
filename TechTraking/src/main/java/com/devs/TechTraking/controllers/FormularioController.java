package com.devs.TechTraking.controllers;


import com.devs.TechTraking.model.Equipo;
import com.devs.TechTraking.model.Tecnico;
import com.devs.TechTraking.repository.EquipoRepository;
import com.devs.TechTraking.repository.RevisionRepository;
import com.devs.TechTraking.repository.TecnicoRepository;
import com.devs.TechTraking.service.RevisionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    @Autowired
    private TecnicoRepository tecnicoRepository;
    @Autowired
    private RevisionRepository revisionRepository;
    @Autowired
    private RevisionService revisionService;

    @GetMapping("/formulario/{equipoId}")
    public String obtenerFormulario(@PathVariable Long equipoId, Model model){

        Equipo equipo = equipoRepository.findById(equipoId)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));

        model.addAttribute("equipoId", equipo.getId());
        model.addAttribute("marca", equipo.getMarca());
        model.addAttribute("modelo", equipo.getModelo());
        model.addAttribute("cliente", equipo.getCliente().getNombre());
        model.addAttribute("clienteId", equipo.getCliente().getId());


        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String correoUsuario = auth.getName();


        Tecnico tecnico = tecnicoRepository.findByUsuarioCorreo(correoUsuario)
                .orElseThrow(() -> new RuntimeException("Tecnico no encontrado"));

        model.addAttribute("tecnico",tecnico.getNombre());
        model.addAttribute("tecnicoE",tecnico.getEspecialidad());

        String consecutivo = revisionService.getNextConsecutivo();
        model.addAttribute("consecutivo", consecutivo);


        return "formulario2";
    }

}
