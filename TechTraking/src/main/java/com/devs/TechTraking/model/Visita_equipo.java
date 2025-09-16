package com.devs.TechTraking.model;
import jakarta.persistence.*;



@Entity
@Table(name = "visita_equipo")
public class Visita_equipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "visita_id",referencedColumnName = "Id")
    private Visita visita;
    @ManyToOne
    @JoinColumn(name = "equipo_id",referencedColumnName = "Id")
    private Equipo equipo;
    public Visita_equipo() {
    }

    public Visita_equipo(Integer id, Visita visita, Equipo equipo) {
        this.id = id;
        this.visita = visita;
        this.equipo = equipo;
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

}
