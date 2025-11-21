package com.devs.TechTraking.mapper;

import com.devs.TechTraking.DTO.RepuestoDto;
import com.devs.TechTraking.model.Cliente;
import com.devs.TechTraking.model.Equipo;
import com.devs.TechTraking.model.Repuesto;
import com.devs.TechTraking.model.Revision;

public class RepuestoMapper {

    // DTO → Entity
    public static Repuesto toEntity(RepuestoDto dto, Cliente cliente, Equipo equipo, Revision revision) {

        Repuesto repuesto = new Repuesto();

        repuesto.setSerie(dto.getSerie());
        repuesto.setNombre(dto.getNombre());
        repuesto.setReferencia(dto.getReferencia());

        repuesto.setCliente(cliente);
        repuesto.setEquipo(equipo);
        repuesto.setRevision(revision);

        return repuesto;
    }

    // Entity → DTO
    public static RepuestoDto toDto(Repuesto repuesto) {

        RepuestoDto dto = new RepuestoDto();

        dto.setSerie(repuesto.getSerie());
        dto.setNombre(repuesto.getNombre());
        dto.setReferencia(repuesto.getReferencia());

        dto.setClienteId(repuesto.getCliente() != null ? repuesto.getCliente().getId() : null);
        dto.setEquipoId(repuesto.getEquipo() != null ? repuesto.getEquipo().getId() : null);
        dto.setRevisionId(repuesto.getRevision() != null ? repuesto.getRevision().getId() : null);

        return dto;
    }
}
