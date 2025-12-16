package com.devs.TechTraking.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "_Revision")    
public class Revision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 5)
    private String consecutivo;


    // ✅ Checklist (31 preguntas Sí/No del documento)
    //ESTADO GENERAL
    private boolean equipoEnciende;
    private boolean estaOperando;
    private boolean estaPartido;
    private boolean estaManchado;
    //PIEZAS FALTANTES
    private boolean tornillos;
    private boolean tapas;
    private boolean display;
    private boolean tarjetasElectronicas;
    private boolean botones;
    private boolean cabezal;
    //PARTE MECANICA
    private boolean oxido;
    private boolean ruidos;
    private boolean piñoneriaEnBuenEstado;
    private boolean correasEnBuenEstado;
    //PANTALLA
    private boolean funciona;
    private boolean partida;
    private boolean lineasQuemadas;
    private boolean quemada;
    //CABEZAL DE IMPRESION
    private boolean bueno;
    private boolean lineasBlancas;
    private boolean calibrado;
    private boolean limpio;
    //RODILLO DE IMPRESION
    private boolean buenos;
    private boolean picados;
    private boolean rayados;
    private boolean adhesivo;
    //ESTADO ELECTRONICO
    private boolean humedad;
    private boolean tarjetaElectronica;


    // 🔹 Relación con Cliente
    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    // 🔹 Relación con Equipo
    @ManyToOne
    @JoinColumn(name = "equipo_id", nullable = false)
    private Equipo equipo;

    // Otros datos de la revisión
    private String observaciones;
    private LocalDate fecha = LocalDate.now();

    // --- Getters & Setters ---

    public Revision() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getConsecutivo() {
        return consecutivo;
    }

    public void setConsecutivo(String consecutivo) {
        this.consecutivo = consecutivo;
    }

    public boolean isEquipoEnciende() {
        return equipoEnciende;
    }

    public boolean isEstaOperando() {
        return estaOperando;
    }

    public void setEstaOperando(boolean estaOperando) {
        this.estaOperando = estaOperando;
    }

    public void setEquipoEnciende(boolean equipoEnciende) {
        this.equipoEnciende = equipoEnciende;
    }

    public boolean isEstaPartido() {
        return estaPartido;
    }

    public void setEstaPartido(boolean estaPartido) {
        this.estaPartido = estaPartido;
    }

    public boolean isEstaManchado() {
        return estaManchado;
    }

    public void setEstaManchado(boolean estaManchado) {
        this.estaManchado = estaManchado;
    }

    public boolean isTornillos() {
        return tornillos;
    }

    public void setTornillos(boolean tornillos) {
        this.tornillos = tornillos;
    }

    public boolean isTapas() {
        return tapas;
    }

    public void setTapas(boolean tapas) {
        this.tapas = tapas;
    }

    public boolean isDisplay() {
        return display;
    }

    public void setDisplay(boolean display) {
        this.display = display;
    }

    public boolean isTarjetasElectronicas() {
        return tarjetasElectronicas;
    }

    public void setTarjetasElectronicas(boolean tarjetasElectronicas) {
        this.tarjetasElectronicas = tarjetasElectronicas;
    }

    public boolean isBotones() {
        return botones;
    }

    public void setBotones(boolean botones) {
        this.botones = botones;
    }

    public boolean isCabezal() {
        return cabezal;
    }

    public void setCabezal(boolean cabezal) {
        this.cabezal = cabezal;
    }

    public boolean isOxido() {
        return oxido;
    }

    public void setOxido(boolean oxido) {
        this.oxido = oxido;
    }

    public boolean isRuidos() {
        return ruidos;
    }

    public void setRuidos(boolean ruidos) {
        this.ruidos = ruidos;
    }

    public boolean isPiñoneriaEnBuenEstado() {
        return piñoneriaEnBuenEstado;
    }

    public void setPiñoneriaEnBuenEstado(boolean piñoneriaEnBuenEstado) {
        this.piñoneriaEnBuenEstado = piñoneriaEnBuenEstado;
    }

    public boolean isCorreasEnBuenEstado() {
        return correasEnBuenEstado;
    }

    public void setCorreasEnBuenEstado(boolean correasEnBuenEstado) {
        this.correasEnBuenEstado = correasEnBuenEstado;
    }

    public boolean isFunciona() {
        return funciona;
    }

    public void setFunciona(boolean funciona) {
        this.funciona = funciona;
    }

    public boolean isPartida() {
        return partida;
    }

    public void setPartida(boolean partida) {
        this.partida = partida;
    }

    public boolean isLineasQuemadas() {
        return lineasQuemadas;
    }

    public void setLineasQuemadas(boolean lineasQuemadas) {
        this.lineasQuemadas = lineasQuemadas;
    }

    public boolean isQuemada() {
        return quemada;
    }

    public void setQuemada(boolean quemada) {
        this.quemada = quemada;
    }

    public boolean isBueno() {
        return bueno;
    }

    public void setBueno(boolean bueno) {
        this.bueno = bueno;
    }

    public boolean isLineasBlancas() {
        return lineasBlancas;
    }

    public void setLineasBlancas(boolean lineasBlancas) {
        this.lineasBlancas = lineasBlancas;
    }

    public boolean isCalibrado() {
        return calibrado;
    }

    public void setCalibrado(boolean calibrado) {
        this.calibrado = calibrado;
    }

    public boolean isLimpio() {
        return limpio;
    }

    public void setLimpio(boolean limpio) {
        this.limpio = limpio;
    }

    public boolean isBuenos() {
        return buenos;
    }

    public void setBuenos(boolean buenos) {
        this.buenos = buenos;
    }

    public boolean isPicados() {
        return picados;
    }

    public void setPicados(boolean picados) {
        this.picados = picados;
    }

    public boolean isRayados() {
        return rayados;
    }

    public void setRayados(boolean rayados) {
        this.rayados = rayados;
    }

    public boolean isAdhesivo() {
        return adhesivo;
    }

    public void setAdhesivo(boolean adhesivo) {
        this.adhesivo = adhesivo;
    }

    public boolean isHumedad() {
        return humedad;
    }

    public void setHumedad(boolean humedad) {
        this.humedad = humedad;
    }

    public boolean isTarjetaElectronica() {
        return tarjetaElectronica;
    }

    public void setTarjetaElectronica(boolean tarjetaElectronica) {
        this.tarjetaElectronica = tarjetaElectronica;
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

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }
}
