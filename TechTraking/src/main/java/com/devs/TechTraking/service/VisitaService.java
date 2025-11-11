package com.devs.TechTraking.service;

import com.devs.TechTraking.enums.EstadoVisita;
import com.devs.TechTraking.enums.TipoServicio;
import com.devs.TechTraking.model.Cliente;
import com.devs.TechTraking.model.Equipo;
import com.devs.TechTraking.model.Tecnico;
import com.devs.TechTraking.model.Visita;
import com.devs.TechTraking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class VisitaService {

    @Autowired
    private EquipoRepository equipoRepository;
    @Autowired
    private VisitaRepository visitaRepository;
    @Autowired
    private VisitaEquipoRepository visitaEquipoRepository;
    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private TecnicoRepository tecnicoRepository;
    @Autowired
    private EnviarCorreoService enviarCorreoService;


    public List<Visita> obtenerVisitas(LocalDate inicio,LocalDate fin){

        return visitaRepository.findByFechaBetween(inicio, fin);

    }

    public Visita crearVisita(Visita visita){

        LocalDate hoy = LocalDate.now();
        LocalDate fechaVisita = visita.getFecha();


        if(!fechaVisita.isAfter(hoy.plusDays(1))){
            throw new IllegalArgumentException("La visita debe programarse con al menos un dia de diferencia");
        }

        if (visita.getCliente() != null && visita.getCliente().getId() != null) {
            Cliente cliente = clienteRepository.findById(visita.getCliente().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado"));
            visita.setCliente(cliente);
        } else {
            throw new IllegalArgumentException("Se debe proporcionar un cliente válido");
        }

        if (visita.getEquipos() != null && !visita.getEquipos().isEmpty()) {
            List<Long> equipoIds = visita.getEquipos().stream()
                    .map(Equipo::getId)
                    .toList();
            List<Equipo> equipos = equipoRepository.findAllById(equipoIds);
            visita.setEquipos(equipos);
        } else {
            visita.setEquipos(new ArrayList<>()); // Evitar null
        }

        visita.setEstado(EstadoVisita.AGENDADA);
        Visita nuevaVisita = visitaRepository.save(visita);
        Visita visitaCompleta = visitaRepository.findVisitaCompleta(nuevaVisita.getId())
                .orElseThrow(() -> new RuntimeException("No se pudo cargar la visita completa"));

        if (visitaCompleta.getTecnico() != null) {
            enviarCorreoService.EnviarAsignacionVisita(
                    visitaCompleta.getTecnico().getUsuario().getCorreo(),
                    visitaCompleta.getTecnico(),
                    visitaCompleta
            );
        }

        return visitaCompleta;
    }

    public Visita actualizarVisita(Integer Id, Visita datosActualizados){
        Visita visita = visitaRepository.findById(Id)
                .orElseThrow(()-> new IllegalArgumentException("Visita no encontrada"));
        if (datosActualizados.getFecha() !=null && !datosActualizados.getFecha().equals(visita.getFecha())){
            LocalDate hoy = LocalDate.now();

            if(!datosActualizados.getFecha().isAfter(hoy.plusDays(1))){
                throw new IllegalArgumentException("La reasignacion de la visita debe ser con un dia de anticipacion");
            }

            visita.setFecha(datosActualizados.getFecha());

        }
        if (datosActualizados.getTecnico() != null) {
            visita.setTecnico(datosActualizados.getTecnico());
        }
        if (datosActualizados.getEstado() != null) {
            visita.setEstado(datosActualizados.getEstado());
        }

        return visitaRepository.save(visita);
    }

    public void eliminarVisita(Integer id) {
        Visita visita = visitaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Visita no encontrada"));

        LocalDate hoy = LocalDate.now();

        if (!visita.getFecha().isAfter(hoy.plusDays(1))) {
            throw new IllegalArgumentException("La visita solo puede eliminarse con al menos un día de anticipación");
        }

        visitaRepository.delete(visita);
    }

    public Visita obtenerPorId(Integer id){
        return visitaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Visita no encontrada"));
    }



}
