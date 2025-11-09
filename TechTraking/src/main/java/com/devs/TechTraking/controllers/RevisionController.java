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

    /**
     * Crea una nueva revisión, asigna consecutivo, genera PDF y envía el correo al cliente.
     */
    @PostMapping("/crearRevisiones")
    public ResponseEntity<RevisionDto> createRevision(@RequestBody RevisionDto dto) {
        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        Equipo equipo = equipoRepository.findById(dto.getEquipoId())
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));

        // 🔹 Convertir DTO a entidad
        Revision revision = RevisionMapper.toEntity(dto, cliente, equipo);

        // 🔹 Guardar revisión (el servicio se encarga de generar el consecutivo)
        Revision saved = revisionService.saveRevision(revision);

        // 🔹 Generar el PDF del informe
        ByteArrayInputStream pdfStream = informeService.generarReporte(saved);

        // 🔹 Enviar correo al cliente
        try {
            String correo = cliente.getCorreo();
            if (correo == null || correo.isEmpty()) {
                throw new RuntimeException("El cliente no tiene un correo registrado.");
            }

            String asunto = "Informe de revisión de equipo #" + saved.getConsecutivo();
            String cuerpo = "Estimado(a) " + cliente.getNombre() +
                    ",\n\nAdjunto encontrará el informe de revisión correspondiente al consecutivo Nº " +
                    saved.getConsecutivo() +
                    " del equipo " + equipo.getModelo() +
                    ".\n\nSaludos,\nEquipo Técnico TechTracking.";

            emailService.enviarInformePdf(correo, asunto, cuerpo, pdfStream);
            System.out.println("✅ Correo enviado con el consecutivo " + saved.getConsecutivo());

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("⚠️ No se pudo enviar el correo: " + e.getMessage());
        }

        // 🔹 Devolver DTO actualizado con el consecutivo
        return ResponseEntity.ok(RevisionMapper.toDto(saved));
    }

    /**
     * Obtiene todas las revisiones con su consecutivo.
     */
    @GetMapping("/obtenerRevisiones")
    public List<RevisionDto> getAllRevisiones() {
        return revisionService.getAllRevisiones()
                .stream()
                .map(RevisionMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene una revisión específica por ID.
     */
    @GetMapping("/{id}")
    public RevisionDto getRevisionById(@PathVariable Long id) {
        Revision revision = revisionService.getRevisionById(id);
        if (revision == null) throw new RuntimeException("Revisión no encontrada");
        return RevisionMapper.toDto(revision);
    }
}
