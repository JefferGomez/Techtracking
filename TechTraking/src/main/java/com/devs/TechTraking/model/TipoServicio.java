package com.devs.TechTraking.model;

import jakarta.persistence.*;

import java.time.LocalDate;


@Entity
@Table(name = "tipo_servicio")
public class TipoServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String descripcion;
    private Double precioBase;
    private LocalDate fechaCreacion;
    private LocalDate fechaActualizacion;
    private String estado;


    public TipoServicio() {}


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}