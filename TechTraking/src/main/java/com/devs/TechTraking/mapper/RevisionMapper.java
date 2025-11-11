package com.devs.TechTraking.mapper;

import com.devs.TechTraking.DTO.RevisionDto;
import com.devs.TechTraking.model.Cliente;
import com.devs.TechTraking.model.Equipo;
import com.devs.TechTraking.model.Revision;

public class RevisionMapper {

    // 🔹 DTO → Entity
    public static Revision toEntity(RevisionDto dto, Cliente cliente, Equipo equipo) {
        Revision revision = new Revision();

        // 🔹 Nuevos campos
        revision.setEquipoGarantia(dto.isEquipoGarantia());
        revision.setOtroPiezaFaltante(dto.getOtroPiezaFaltante());
        revision.setOtroParteMecanica(dto.getOtroParteMecanica());
        revision.setOtroEstadoElectronico(dto.getOtroEstadoElectronico());
        revision.setTipoImpresora(dto.getTipoImpresora());

        // ✅ Resto igual
        revision.setEquipoEnciende(dto.isEquipoEnciende());
        revision.setEstaOperando(dto.isEstaOperando());
        revision.setEstaPartido(dto.isEstaPartido());
        revision.setEstaManchado(dto.isEstaManchado());

        revision.setTornillos(dto.isTornillos());
        revision.setTapas(dto.isTapas());
        revision.setDisplay(dto.isDisplay());
        revision.setTarjetasElectronicas(dto.isTarjetasElectronicas());
        revision.setBotones(dto.isBotones());
        revision.setCabezal(dto.isCabezal());

        revision.setOxido(dto.isOxido());
        revision.setRuidos(dto.isRuidos());
        revision.setPiñoneriaEnBuenEstado(dto.isPiñoneriaEnBuenEstado());
        revision.setCorreasEnBuenEstado(dto.isCorreasEnBuenEstado());

        revision.setFunciona(dto.isFunciona());
        revision.setPartida(dto.isPartida());
        revision.setLineasQuemadas(dto.isLineasQuemadas());
        revision.setQuemada(dto.isQuemada());

        revision.setBueno(dto.isBueno());
        revision.setLineasBlancas(dto.isLineasBlancas());
        revision.setCalibrado(dto.isCalibrado());
        revision.setLimpio(dto.isLimpio());

        revision.setBuenos(dto.isBuenos());
        revision.setPicados(dto.isPicados());
        revision.setRayados(dto.isRayados());
        revision.setAdhesivo(dto.isAdhesivo());

        revision.setHumedad(dto.isHumedad());
        revision.setTarjetaElectronica(dto.isTarjetaElectronica());

        // Relaciones
        revision.setCliente(cliente);
        revision.setEquipo(equipo);

        // Otros
        revision.setObservaciones(dto.getObservaciones());
        revision.setFecha(dto.getFecha() != null ? dto.getFecha() : revision.getFecha());

        return revision;
    }

    // 🔹 Entity → DTO
    public static RevisionDto toDto(Revision revision) {
        RevisionDto dto = new RevisionDto();


        // 🔹 Nuevos campos
        dto.setTipoImpresora(revision.getTipoImpresora());
        dto.setEquipoGarantia(revision.isEquipoGarantia());
        dto.setOtroPiezaFaltante(revision.getOtroPiezaFaltante());
        dto.setOtroParteMecanica(revision.getOtroParteMecanica());
        dto.setOtroEstadoElectronico(revision.getOtroEstadoElectronico());
        dto.setConsecutivo(revision.getConsecutivo());


        // ✅ Resto igual
        dto.setEquipoEnciende(revision.isEquipoEnciende());
        dto.setEstaOperando(revision.isEstaOperando());
        dto.setEstaPartido(revision.isEstaPartido());
        dto.setEstaManchado(revision.isEstaManchado());

        dto.setTornillos(revision.isTornillos());
        dto.setTapas(revision.isTapas());
        dto.setDisplay(revision.isDisplay());
        dto.setTarjetasElectronicas(revision.isTarjetasElectronicas());
        dto.setBotones(revision.isBotones());
        dto.setCabezal(revision.isCabezal());

        dto.setOxido(revision.isOxido());
        dto.setRuidos(revision.isRuidos());
        dto.setPiñoneriaEnBuenEstado(revision.isPiñoneriaEnBuenEstado());
        dto.setCorreasEnBuenEstado(revision.isCorreasEnBuenEstado());

        dto.setFunciona(revision.isFunciona());
        dto.setPartida(revision.isPartida());
        dto.setLineasQuemadas(revision.isLineasQuemadas());
        dto.setQuemada(revision.isQuemada());

        dto.setBueno(revision.isBueno());
        dto.setLineasBlancas(revision.isLineasBlancas());
        dto.setCalibrado(revision.isCalibrado());
        dto.setLimpio(revision.isLimpio());

        dto.setBuenos(revision.isBuenos());
        dto.setPicados(revision.isPicados());
        dto.setRayados(revision.isRayados());
        dto.setAdhesivo(revision.isAdhesivo());

        dto.setHumedad(revision.isHumedad());
        dto.setTarjetaElectronica(revision.isTarjetaElectronica());

        // Relaciones (solo IDs)
        dto.setClienteId(revision.getCliente() != null ? revision.getCliente().getId() : null);
        dto.setEquipoId(revision.getEquipo() != null ? revision.getEquipo().getId() : null);

        // Otros
        dto.setObservaciones(revision.getObservaciones());
        dto.setFecha(revision.getFecha());

        return dto;
    }
}
