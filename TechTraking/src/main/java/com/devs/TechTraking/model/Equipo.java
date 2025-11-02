package com.devs.TechTraking.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Equipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String marca;
    private String modelo;
    private String serial;
    private String tipo;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)

    @JsonBackReference
    private Cliente cliente;
    @ManyToMany(mappedBy = "equipos")
    @JsonIgnore
    private List<Visita> visitas = new ArrayList<>();

    public Equipo() {
    }

    public Equipo(Long id, String marca, String modelo,String  serial, String tipo, Cliente cliente, List<Visita> visitas) {
        this.id = id;
        this.marca = marca;
        this.modelo = modelo;
        this.serial = serial;
        this.tipo = tipo;
        this.cliente = cliente;
        this.visitas = visitas;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
   
        this.id = id;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) { this.modelo = modelo;}

    public String getSerial() {
        return serial;
    }

    public void setSerial(String serial) {
        this.serial = serial;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public List<Visita> getVisitas() {
        return visitas;
    }

    public void setVisitas(List<Visita> visitas) {
        this.visitas = visitas;
    }
}



