package com.devs.TechTraking.DTO;

public class EquipoDTO {

    private int id; // ✅ ID manual
    private String marca;
    private String modelo;
    private String serie;
    private String tipo;
    private Long clienteId;

    // Constructor vacío
    public EquipoDTO() {}

    // Constructor con todos los campos
    public EquipoDTO(int id, String marca, String modelo, String serie, String tipo, Long clienteId) {
        this.id = id;
        this.marca = marca;
        this.modelo = modelo;
        this.serie = serie;
        this.tipo = tipo;
        this.clienteId = clienteId;
    }

    // ✅ Getter y Setter del ID
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    // Getters y Setters existentes
    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getSerie() {
        return serie;
    }

    public void setSerie(String serie) {
        this.serie = serie;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }
}
