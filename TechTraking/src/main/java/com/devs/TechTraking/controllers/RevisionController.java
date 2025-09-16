package com.devs.TechTraking.controllers;

import com.devs.TechTraking.DTO.RevisionDto;
import com.devs.TechTraking.mapper.RevisionMapper;
import com.devs.TechTraking.model.Cliente;
import com.devs.TechTraking.model.Equipo;
import com.devs.TechTraking.model.Revision;
import com.devs.TechTraking.repository.ClienteRepository;
import com.devs.TechTraking.repository.EquipoRepository;
import com.devs.TechTraking.service.RevisionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/revisiones")
@CrossOrigin(origins = "*")
public class RevisionController {

    private final RevisionService revisionService;
    private final ClienteRepository clienteRepository;
    private final EquipoRepository equipoRepository;

    public RevisionController(RevisionService revisionService,
                              ClienteRepository clienteRepository,
                              EquipoRepository equipoRepository) {
        this.revisionService = revisionService;
        this.clienteRepository = clienteRepository;
        this.equipoRepository = equipoRepository;
    }

    @PostMapping
    public RevisionDto createRevision(@RequestBody RevisionDto dto) {
        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        Equipo equipo = equipoRepository.findById(dto.getEquipoId())
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));

        Revision revision = RevisionMapper.toEntity(dto, cliente, equipo);
        Revision saved = revisionService.saveRevision(revision);

        return RevisionMapper.toDto(saved);
    }

    @GetMapping
    public List<RevisionDto> getAllRevisiones() {
        return revisionService.getAllRevisiones()
                .stream()
                .map(RevisionMapper::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public RevisionDto getRevisionById(@PathVariable Long id) {
        Revision revision = revisionService.getRevisionById(id);
        if (revision == null) throw new RuntimeException("Revisión no encontrada");
        return RevisionMapper.toDto(revision);
    }
}
