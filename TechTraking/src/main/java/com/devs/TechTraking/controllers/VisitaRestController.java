    package com.devs.TechTraking.controllers;

    import com.devs.TechTraking.model.Equipo;
    import com.devs.TechTraking.model.Visita;
    import com.devs.TechTraking.service.EquipoService;
    import com.devs.TechTraking.service.VisitaService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.web.bind.annotation.*;

    import java.time.LocalDate;
    import java.util.List;

    @RestController
    @RequestMapping("/admin")
    public class VisitaRestController {

        @Autowired
        private VisitaService visitaService;
        @Autowired
        private EquipoService equipoService;


        @GetMapping("/mostrarVisitas")
        public List<Visita> obtenerVisitas(@RequestParam LocalDate inicio,
                                           @RequestParam LocalDate fin
        ){
            return visitaService.obtenerVisitas(inicio, fin);
        }

        @GetMapping("/equipoCliente/{clienteId}")
        public List<Equipo> obtenerEquiposPorCliente(@PathVariable Integer clienteId) {
            return equipoService.obtenerEquiposPorCliente(clienteId);
        }

        @PostMapping("/crearVisitas")
        public Visita crearVisita(@RequestBody Visita visita){
            return visitaService.crearVisita(visita);
        }

        @PutMapping("/actualizarVisita/{id}")
        public Visita actualizarVisita(@PathVariable Integer id,
                                       @RequestBody Visita datosActualizados
        ){
            return visitaService.actualizarVisita(id,datosActualizados);
        }

        @DeleteMapping("/eliminarVisita/{id}")
        public void eliminarVisita(@PathVariable Integer id){
            visitaService.eliminarVisita(id);
        }



    }
