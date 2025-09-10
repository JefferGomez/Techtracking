package com.devs.TechTraking.DTO;

import java.time.LocalDateTime;

public class RevisionDto {

    private Long id;

    // ✅ Checklist (31 preguntas Sí/No)
    private boolean equipoEnciende;
    private boolean displayFunciona;
    private boolean alarmasActivas;
    private boolean presentaFugas;
    private boolean cablesEnBuenEstado;
    private boolean nivelesCorrectos;
    private boolean limpiezaGeneral;
    private boolean filtrosLimpios;
    private boolean ventilacionAdecuada;
    private boolean botonEmergenciaFunciona;
    private boolean calibracionCorrecta;
    private boolean accesoriosCompletos;
    private boolean fusiblesBuenEstado;
    private boolean conexionesFirmes;
    private boolean tierraFisicaCorrecta;
    private boolean lucesIndicadorasFuncionan;
    private boolean ventiladoresOperativos;
    private boolean bateriasOperativas;
    private boolean gabineteSinOxido;
    private boolean perillasBuenEstado;
    private boolean manguerasBuenEstado;
    private boolean presionAdecuada;
    private boolean temperaturaNormal;
    private boolean sensoresFuncionales;
    private boolean softwareActualizado;
    private boolean sistemaSonoroFunciona;
    private boolean tapasCorrectamenteColocadas;
    private boolean puertasCierranBien;
    private boolean sinVibraciones;
    private boolean rotulosVisibles;
    private boolean manualDisponible;

    // Relaciones simplificadas
    private Long clienteId;
    private Long equipoId;

    private String observaciones;
    private LocalDateTime fecha;

    public RevisionDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean isEquipoEnciende() {
        return equipoEnciende;
    }

    public void setEquipoEnciende(boolean equipoEnciende) {
        this.equipoEnciende = equipoEnciende;
    }

    public boolean isDisplayFunciona() {
        return displayFunciona;
    }

    public void setDisplayFunciona(boolean displayFunciona) {
        this.displayFunciona = displayFunciona;
    }

    public boolean isAlarmasActivas() {
        return alarmasActivas;
    }

    public void setAlarmasActivas(boolean alarmasActivas) {
        this.alarmasActivas = alarmasActivas;
    }

    public boolean isPresentaFugas() {
        return presentaFugas;
    }

    public void setPresentaFugas(boolean presentaFugas) {
        this.presentaFugas = presentaFugas;
    }

    public boolean isCablesEnBuenEstado() {
        return cablesEnBuenEstado;
    }

    public void setCablesEnBuenEstado(boolean cablesEnBuenEstado) {
        this.cablesEnBuenEstado = cablesEnBuenEstado;
    }

    public boolean isNivelesCorrectos() {
        return nivelesCorrectos;
    }

    public void setNivelesCorrectos(boolean nivelesCorrectos) {
        this.nivelesCorrectos = nivelesCorrectos;
    }

    public boolean isLimpiezaGeneral() {
        return limpiezaGeneral;
    }

    public void setLimpiezaGeneral(boolean limpiezaGeneral) {
        this.limpiezaGeneral = limpiezaGeneral;
    }

    public boolean isFiltrosLimpios() {
        return filtrosLimpios;
    }

    public void setFiltrosLimpios(boolean filtrosLimpios) {
        this.filtrosLimpios = filtrosLimpios;
    }

    public boolean isVentilacionAdecuada() {
        return ventilacionAdecuada;
    }

    public void setVentilacionAdecuada(boolean ventilacionAdecuada) {
        this.ventilacionAdecuada = ventilacionAdecuada;
    }

    public boolean isBotonEmergenciaFunciona() {
        return botonEmergenciaFunciona;
    }

    public void setBotonEmergenciaFunciona(boolean botonEmergenciaFunciona) {
        this.botonEmergenciaFunciona = botonEmergenciaFunciona;
    }

    public boolean isCalibracionCorrecta() {
        return calibracionCorrecta;
    }

    public void setCalibracionCorrecta(boolean calibracionCorrecta) {
        this.calibracionCorrecta = calibracionCorrecta;
    }

    public boolean isAccesoriosCompletos() {
        return accesoriosCompletos;
    }

    public void setAccesoriosCompletos(boolean accesoriosCompletos) {
        this.accesoriosCompletos = accesoriosCompletos;
    }

    public boolean isFusiblesBuenEstado() {
        return fusiblesBuenEstado;
    }

    public void setFusiblesBuenEstado(boolean fusiblesBuenEstado) {
        this.fusiblesBuenEstado = fusiblesBuenEstado;
    }

    public boolean isConexionesFirmes() {
        return conexionesFirmes;
    }

    public void setConexionesFirmes(boolean conexionesFirmes) {
        this.conexionesFirmes = conexionesFirmes;
    }

    public boolean isTierraFisicaCorrecta() {
        return tierraFisicaCorrecta;
    }

    public void setTierraFisicaCorrecta(boolean tierraFisicaCorrecta) {
        this.tierraFisicaCorrecta = tierraFisicaCorrecta;
    }

    public boolean isLucesIndicadorasFuncionan() {
        return lucesIndicadorasFuncionan;
    }

    public void setLucesIndicadorasFuncionan(boolean lucesIndicadorasFuncionan) {
        this.lucesIndicadorasFuncionan = lucesIndicadorasFuncionan;
    }

    public boolean isVentiladoresOperativos() {
        return ventiladoresOperativos;
    }

    public void setVentiladoresOperativos(boolean ventiladoresOperativos) {
        this.ventiladoresOperativos = ventiladoresOperativos;
    }

    public boolean isBateriasOperativas() {
        return bateriasOperativas;
    }

    public void setBateriasOperativas(boolean bateriasOperativas) {
        this.bateriasOperativas = bateriasOperativas;
    }

    public boolean isGabineteSinOxido() {
        return gabineteSinOxido;
    }

    public void setGabineteSinOxido(boolean gabineteSinOxido) {
        this.gabineteSinOxido = gabineteSinOxido;
    }

    public boolean isPerillasBuenEstado() {
        return perillasBuenEstado;
    }

    public void setPerillasBuenEstado(boolean perillasBuenEstado) {
        this.perillasBuenEstado = perillasBuenEstado;
    }

    public boolean isManguerasBuenEstado() {
        return manguerasBuenEstado;
    }

    public void setManguerasBuenEstado(boolean manguerasBuenEstado) {
        this.manguerasBuenEstado = manguerasBuenEstado;
    }

    public boolean isPresionAdecuada() {
        return presionAdecuada;
    }

    public void setPresionAdecuada(boolean presionAdecuada) {
        this.presionAdecuada = presionAdecuada;
    }

    public boolean isTemperaturaNormal() {
        return temperaturaNormal;
    }

    public void setTemperaturaNormal(boolean temperaturaNormal) {
        this.temperaturaNormal = temperaturaNormal;
    }

    public boolean isSensoresFuncionales() {
        return sensoresFuncionales;
    }

    public void setSensoresFuncionales(boolean sensoresFuncionales) {
        this.sensoresFuncionales = sensoresFuncionales;
    }

    public boolean isSoftwareActualizado() {
        return softwareActualizado;
    }

    public void setSoftwareActualizado(boolean softwareActualizado) {
        this.softwareActualizado = softwareActualizado;
    }

    public boolean isSistemaSonoroFunciona() {
        return sistemaSonoroFunciona;
    }

    public void setSistemaSonoroFunciona(boolean sistemaSonoroFunciona) {
        this.sistemaSonoroFunciona = sistemaSonoroFunciona;
    }

    public boolean isTapasCorrectamenteColocadas() {
        return tapasCorrectamenteColocadas;
    }

    public void setTapasCorrectamenteColocadas(boolean tapasCorrectamenteColocadas) {
        this.tapasCorrectamenteColocadas = tapasCorrectamenteColocadas;
    }

    public boolean isPuertasCierranBien() {
        return puertasCierranBien;
    }

    public void setPuertasCierranBien(boolean puertasCierranBien) {
        this.puertasCierranBien = puertasCierranBien;
    }

    public boolean isSinVibraciones() {
        return sinVibraciones;
    }

    public void setSinVibraciones(boolean sinVibraciones) {
        this.sinVibraciones = sinVibraciones;
    }

    public boolean isRotulosVisibles() {
        return rotulosVisibles;
    }

    public void setRotulosVisibles(boolean rotulosVisibles) {
        this.rotulosVisibles = rotulosVisibles;
    }

    public boolean isManualDisponible() {
        return manualDisponible;
    }

    public void setManualDisponible(boolean manualDisponible) {
        this.manualDisponible = manualDisponible;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public Long getEquipoId() {
        return equipoId;
    }

    public void setEquipoId(Long equipoId) {
        this.equipoId = equipoId;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }
}
