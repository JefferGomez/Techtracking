package com.devs.TechTraking.model;
import jakarta.persistence.*;



@Entity
@Table(name = "visita_equipo")
public class Visita_equipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "visita_id", nullable = false)
    private Visita visita;
    @ManyToOne
    @JoinColumn(name = "equipo_id", nullable = false)
    private Equipo equipo;
    private String estadoEquipo;

    public Visita_equipo() {
    }

    public Visita_equipo(Integer id, Visita visita, Equipo equipo, String estadoEquipo) {
        this.id = id;
        this.visita = visita;
        this.equipo = equipo;
        this.estadoEquipo = estadoEquipo;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Visita getVisita() {
        return visita;
    }

    public void setVisita(Visita visita) {
        this.visita = visita;
    }

    public Equipo getEquipo() {
        return equipo;
    }

    public void setEquipo(Equipo equipo) {
        this.equipo = equipo;
    }


    public String getEstadoEquipo() {
        return estadoEquipo;
    }

    public void setEstadoEquipo(String estadoEquipo) {
        this.estadoEquipo = estadoEquipo;
    }
}
