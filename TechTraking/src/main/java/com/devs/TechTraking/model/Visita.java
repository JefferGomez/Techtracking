package com.devs.TechTraking.model;


import com.devs.TechTraking.enums.Estadovisita;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "visita")
public class Visita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private LocalDate fecha;
    @ManyToOne
    @JoinColumn(name = "tecnico_id")
    private Tecnico tecnicoId;
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente clienteId; @ManyToOne
    @JoinColumn(name = "equipo_id")
    private Equipo equipoId;
    @ManyToOne
    @JoinColumn(name = "tipo_servicioId")
    private TipoServicio tipoServicioId;
    private Estadovisita estado;


    public Visita() {
    }

    public Visita(Integer id, LocalDate fecha, Tecnico tecnicoId, Cliente clienteId, Equipo equipoId, TipoServicio tipoServicioId, Estadovisita estado) {
        this.id = id;
        this.fecha = fecha;
        this.tecnicoId = tecnicoId;
        this.clienteId = clienteId;
        this.equipoId = equipoId;
        this.tipoServicioId = tipoServicioId;
        this.estado = estado;
    }


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public Tecnico getTecnicoId() {
        return tecnicoId;
    }

    public void setTecnicoId(Tecnico tecnicoId) {
        this.tecnicoId = tecnicoId;
    }

    public Cliente getClienteId() {
        return clienteId;
    }

    public void setClienteId(Cliente clienteId) {
        this.clienteId = clienteId;
    }

    public Equipo getEquipoId() {
        return equipoId;
    }

    public void setEquipoId(Equipo equipoId) {
        this.equipoId = equipoId;
    }

    public TipoServicio getTipoServicioId() {
        return tipoServicioId;
    }

    public void setTipoServicioId(TipoServicio tipoServicioId) {
        this.tipoServicioId = tipoServicioId;
    }

    public Estadovisita getEstado() {
        return estado;
    }

    public void setEstado(Estadovisita estado) {
        this.estado = estado;
    }
}
