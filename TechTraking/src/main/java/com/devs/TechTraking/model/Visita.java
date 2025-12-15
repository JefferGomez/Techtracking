package com.devs.TechTraking.model;


import com.devs.TechTraking.enums.EstadoVisita;
import com.devs.TechTraking.enums.TipoServicio;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "_visita")
public class Visita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private LocalDate fecha;
    @ManyToOne
    @JoinColumn(name = "tecnico_id")
    @JsonIgnoreProperties({"visitas"})
    private Tecnico tecnico;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cliente_id")
    @JsonIgnoreProperties({"equipos"})
    private Cliente cliente;
    @Enumerated(EnumType.STRING)
    private EstadoVisita estado;
    @Enumerated(EnumType.STRING)
    private TipoServicio tipoServicio;
    @ManyToMany
    @JoinTable(
            name = "visita_equipo",
            joinColumns = @JoinColumn(name = "visita_id"),
            inverseJoinColumns = @JoinColumn(name = "equipo_id")
    )
    @JsonIgnoreProperties("visitas")
    private List<Equipo> equipos = new ArrayList<>();

    public Visita() {
    }

    public Visita(Integer id, LocalDate fecha, Tecnico tecnico, Cliente cliente, EstadoVisita estado, TipoServicio tipoServicio, List<Equipo> equipos) {
        this.id = id;
        this.fecha = fecha;
        this.tecnico = tecnico;
        this.cliente = cliente;
        this.estado = estado;
        this.tipoServicio = tipoServicio;
        this.equipos = equipos;
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

    public Tecnico getTecnico() {
        return tecnico;
    }

    public void setTecnico(Tecnico tecnico) {
        this.tecnico = tecnico;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public EstadoVisita getEstado() {
        return estado;
    }

    public void setEstado(EstadoVisita estado) {
        this.estado = estado;
    }

    public TipoServicio getTipoServicio() {
        return tipoServicio;
    }

    public void setTipoServicio(TipoServicio tipoServicio) {
        this.tipoServicio = tipoServicio;
    }

    public List<Equipo> getEquipos() {
        return equipos;
    }

    public void setEquipos(List<Equipo> equipos) {
        this.equipos = equipos;
    }
}
