package com.devs.TechTraking.controllers;

import com.devs.TechTraking.DTO.RevisionDto;
import com.devs.TechTraking.mapper.RevisionMapper;
import com.devs.TechTraking.model.Cliente;
import com.devs.TechTraking.model.Equipo;
import com.devs.TechTraking.model.Revision;
import com.devs.TechTraking.repository.ClienteRepository;
import com.devs.TechTraking.repository.EquipoRepository;
import com.devs.TechTraking.service.InformeService;
import com.devs.TechTraking.service.EmailService;
import com.devs.TechTraking.service.RevisionService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/tecnico")
@CrossOrigin(origins = "*")
public class RevisionController {

    private final RevisionService revisionService;
    private final ClienteRepository clienteRepository;
    private final EquipoRepository equipoRepository;
    private final InformeService informeService;
    private final EmailService emailService;

    public RevisionController(RevisionService revisionService,
                              ClienteRepository clienteRepository,
                              EquipoRepository equipoRepository,
                              InformeService informeService,
                              EmailService emailService) {
        this.revisionService = revisionService;
        this.clienteRepository = clienteRepository;
        this.equipoRepository = equipoRepository;
        this.informeService = informeService;
        this.emailService = emailService;
    }

    @PostMapping("/crearRevisiones")
    public ResponseEntity<RevisionDto> createRevision(@RequestBody RevisionDto dto) {
        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        Equipo equipo = equipoRepository.findById(dto.getEquipoId())
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));

        // Guardamos la revisión
        Revision revision = RevisionMapper.toEntity(dto, cliente, equipo);
        Revision saved = revisionService.saveRevision(revision);

        // Generamos el PDF con el informe
        ByteArrayInputStream pdfStream = informeService.generarReporte(saved);

        Path carpetaTemp = Paths.get("temp-pdfs");


        String nombreArchivo = "Informe_" + saved.getId() + ".pdf";
        Path archivoPath = carpetaTemp.resolve(nombreArchivo);

        // Guardar el PDF
        try (OutputStream out = Files.newOutputStream(archivoPath)) {
            pdfStream.transferTo(out);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }

        return ResponseEntity.ok(RevisionMapper.toDto(saved));
    }

    @GetMapping("/obtenerRevisiones")
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
