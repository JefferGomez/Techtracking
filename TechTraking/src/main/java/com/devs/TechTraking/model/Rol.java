package com.devs.TechTraking.model;
import com.devs.TechTraking.enums.NombreRol;
import jakarta.persistence.*;


@Entity
@Table(name = "_rol")
public class Rol {

    @Id
    private Integer id;
    @Enumerated(EnumType.STRING)
    private NombreRol nombre;

    public Rol() {
    }

    public Rol(Integer id, NombreRol nombre) {
        this.id = id;
        this.nombre = nombre;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public NombreRol getNombre() {
        return nombre;
    }

    public void setNombre(NombreRol nombre) {
        this.nombre = nombre;
    }
}
