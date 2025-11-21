package com.devs.TechTraking.controllers;

import com.devs.TechTraking.DTO.RevisionDto;
import com.devs.TechTraking.enums.EstadoVisita;
import com.devs.TechTraking.mapper.RevisionMapper;
import com.devs.TechTraking.model.*;
import com.devs.TechTraking.repository.ClienteRepository;
import com.devs.TechTraking.repository.EquipoRepository;
import com.devs.TechTraking.repository.TecnicoRepository;
import com.devs.TechTraking.repository.UsuarioRepository;
import com.devs.TechTraking.service.InformeService;
import com.devs.TechTraking.service.EmailService;
import com.devs.TechTraking.service.RevisionService;
import com.devs.TechTraking.service.VisitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    @Autowired
    private VisitaService visitaService;
    @Autowired
    private TecnicoRepository tecnicoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

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

        // Obtener el usuario logueado
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String correo = auth.getName(); // username

        // El técnico REAL viene del usuario logueado
        Tecnico tecnico = tecnicoRepository.findByUsuarioCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Técnico no encontrado"));



        // 🔹 Convertir DTO a entidad
        Revision revision = RevisionMapper.toEntity(dto, cliente, equipo,tecnico);

        // 🔹 Guardar revisión (el servicio se encarga de generar el consecutivo)
        Revision saved = revisionService.saveRevision(revision);

        // 🔹 Generar el PDF del informe
        ByteArrayInputStream pdfStream = informeService.generarReporte(saved);

        // 🔹 Crear carpeta por técnico
        String tecnicoFolderName = tecnico.getNombre().replace(" ", "_");
        Path tecnicoFolder = Paths.get("temp-pdfs", tecnicoFolderName);

        try {
            Files.createDirectories(tecnicoFolder);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo crear el directorio del técnico", e);
        }

        //🔹 Guardar el PDF dentro de la carpeta del técnico
        String fileName = saved.getConsecutivo() + ".pdf";
        Path filePath = tecnicoFolder.resolve(fileName);

        try {
            Files.write(filePath, pdfStream.readAllBytes());
            System.out.println("📄 PDF creado: " + filePath.toString());
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("No se pudo crear el PDF", e);
        }



        // 🔹 Devolver DTO actualizado con el consecutivo
        return ResponseEntity.ok(RevisionMapper.toDto(saved));
    }


//    enviar todos los pdfs en un correo

    @PostMapping("/finalizarVisita")
    public ResponseEntity<String> finalizarVisita(@RequestParam String correoCliente,@RequestParam String nombreCliente) {
        try {
            String mensaje = revisionService.finalizarVisita(correoCliente,nombreCliente);
            return ResponseEntity.ok(mensaje);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error procesando los informes.");
        }
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



    @PutMapping("/iniciarVisita/{id}")
    public Visita iniciarVisita(@PathVariable Integer id) {
        Visita visita = visitaService.obtenerPorId(id);
        visita.setEstado(EstadoVisita.INICIADA);
        return visitaService.actualizarVisita(id, visita);
    }
    @PutMapping("/finalizarVisita/{id}")
    public Visita finalizarVisita(@PathVariable Integer id) {
        Visita visita = visitaService.obtenerPorId(id);
        visita.setEstado(EstadoVisita.FINALIZADA);
        return visitaService.actualizarVisita(id, visita);
    }



}
