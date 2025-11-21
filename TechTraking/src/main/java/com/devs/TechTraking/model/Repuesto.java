package com.devs.TechTraking.model;

import jakarta.persistence.*;

@Entity
public class Repuesto {

    @Id
    private String serie;

    private String nombre;

    private String referencia;

    // Muchos repuestos pertenecen a un cliente
    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    // Muchos repuestos pertenecen a un equipo
    @ManyToOne
    @JoinColumn(name = "equipo_id", nullable = false)
    private Equipo equipo;

    // 🔹 Relación con Revisiones (muchos repuestos pueden usarse en una revisión)
    @ManyToOne
    @JoinColumn(name = "revision_id")
    private Revision revision;

    public Repuesto() {}

    // Getters & Setters
    public String getSerie() {
        return serie;
    }

    public void setSerie(String serie) {
        this.serie = serie;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getReferencia() {
        return referencia;
    }

    public void setReferencia(String referencia) {
        this.referencia = referencia;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Equipo getEquipo() {
        return equipo;
    }

    public void setEquipo(Equipo equipo) {
        this.equipo = equipo;
    }

    public Revision getRevision() {
        return revision;
    }

    public void setRevision(Revision revision) {
        this.revision = revision;
    }
}
