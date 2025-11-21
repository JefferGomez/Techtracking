package com.devs.TechTraking.controllers;

import com.devs.TechTraking.DTO.RepuestoDto;
import com.devs.TechTraking.mapper.RepuestoMapper;
import com.devs.TechTraking.model.Cliente;
import com.devs.TechTraking.model.Equipo;
import com.devs.TechTraking.model.Revision;
import com.devs.TechTraking.model.Repuesto;
import com.devs.TechTraking.repository.ClienteRepository;
import com.devs.TechTraking.repository.EquipoRepository;
import com.devs.TechTraking.repository.RevisionRepository;
import com.devs.TechTraking.service.RepuestoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/repuestos")
@CrossOrigin(origins = "*")
public class RepuestoController {

    private final RepuestoService repuestoService;
    private final ClienteRepository clienteRepository;
    private final EquipoRepository equipoRepository;
    private final RevisionRepository revisionRepository;

    public RepuestoController(RepuestoService repuestoService,
                              ClienteRepository clienteRepository,
                              EquipoRepository equipoRepository,
                              RevisionRepository revisionRepository) {
        this.repuestoService = repuestoService;
        this.clienteRepository = clienteRepository;
        this.equipoRepository = equipoRepository;
        this.revisionRepository = revisionRepository;
    }

    // Crear repuesto
    @PostMapping("/crear")
    public ResponseEntity<RepuestoDto> crear(@RequestBody RepuestoDto dto) {

        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        Equipo equipo = equipoRepository.findById(dto.getEquipoId())
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));

        Revision revision = null;

        if (dto.getRevisionId() != null) {
            revision = revisionRepository.findById(dto.getRevisionId())
                    .orElseThrow(() -> new RuntimeException("Revisión no encontrada"));
        }

        Repuesto repuesto = RepuestoMapper.toEntity(dto, cliente, equipo, revision);

        Repuesto saved = repuestoService.save(repuesto);

        return ResponseEntity.ok(RepuestoMapper.toDto(saved));
    }

    // Listar todos
    @GetMapping
    public List<RepuestoDto> listar() {
        return repuestoService.findAll()
                .stream()
                .map(RepuestoMapper::toDto)
                .collect(Collectors.toList());
    }

    // Buscar por ID
    @GetMapping("/{serie}")
    public RepuestoDto getById(@PathVariable String serie) {
        return RepuestoMapper.toDto(repuestoService.findById(serie));
    }

    // Eliminar
    @DeleteMapping("/{serie}")
    public ResponseEntity<?> eliminar(@PathVariable String serie) {
        repuestoService.delete(serie);
        return ResponseEntity.ok("Repuesto eliminado");
    }
}
