package com.devs.TechTraking.model;


import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name="intento_login")
public class Intento_login {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "usuario_id",nullable = false)
    private Usuarios usuarioId;

    private LocalDateTime fecha;
    private Boolean exitoso;

    public Intento_login() {
    }

    public Intento_login(int id, Usuarios usuarioId, LocalDateTime fecha, Boolean exitoso) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.fecha = fecha;
        this.exitoso = exitoso;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Usuarios getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Usuarios usuarioId) {
        this.usuarioId = usuarioId;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public Boolean getExitoso() {
        return exitoso;
    }

    public void setExitoso(Boolean exitoso) {
        this.exitoso = exitoso;
    }
}
