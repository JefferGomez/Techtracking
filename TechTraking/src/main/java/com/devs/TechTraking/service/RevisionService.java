package com.devs.TechTraking.service;

import com.devs.TechTraking.model.Revision;
import com.devs.TechTraking.model.Tecnico;
import com.devs.TechTraking.model.Usuarios;
import com.devs.TechTraking.repository.RevisionRepository;
import com.devs.TechTraking.repository.TecnicoRepository;
import com.devs.TechTraking.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
public class RevisionService {

    private final RevisionRepository revisionRepository;
    private final InformeService informeService;
    private final EmailService emailService;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private TecnicoRepository tecnicoRepository;

    public RevisionService(RevisionRepository revisionRepository,
                           InformeService informeService,
                           EmailService emailService) {
        this.revisionRepository = revisionRepository;
        this.informeService = informeService;
        this.emailService = emailService;
    }

    /**
     * Genera el consecutivo de la siguiente revisión en formato "00001", "00002", etc.
     */
    private String generarConsecutivo() {
        Revision ultima = revisionRepository.findUltimaRevision();
        int siguienteNumero = 1;

        if (ultima != null && ultima.getConsecutivo() != null) {
            try {
                siguienteNumero = Integer.parseInt(ultima.getConsecutivo()) + 1;
            } catch (NumberFormatException e) {
                siguienteNumero = 1; // fallback si hay formato inválido
            }
        }

        return String.format("%05d", siguienteNumero);
    }

    /**
     * Guarda una revisión normal con consecutivo automático.
     */
    public Revision saveRevision(Revision revision) {
        if (revision.getConsecutivo() == null || revision.getConsecutivo().isEmpty()) {
            revision.setConsecutivo(generarConsecutivo());
        }
        return revisionRepository.save(revision);
    }

    public List<Revision> getAllRevisiones() {
        return revisionRepository.findAll();
    }

    public Revision getRevisionById(Long id) {
        return revisionRepository.findById(id).orElse(null);
    }

    public String finalizarVisita(String correoCliente, String nombreCliente) {

        // 🔹 Obtener usuario logueado
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String correo = auth.getName();

        Usuarios usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 🔹 Obtener el técnico asociado al usuario
        Tecnico tecnico = tecnicoRepository.findByUsuarioCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Técnico no encontrado"));

        // Carpeta del técnico
        String tecnicoFolderName = tecnico.getNombre().replace(" ", "_");
        Path tecnicoFolder = Paths.get("temp-pdfs", tecnicoFolderName);

        if (!Files.exists(tecnicoFolder)) {
            return "No hay informes pendientes para este técnico.";
        }

        try {

            Path carpetaClientes = Paths.get("registros", "clientes");
            Path carpetaTecnicos = Paths.get("registros", "tecnicos");

            // Crear carpeta del cliente
            String nombreSeguroCliente = nombreCliente.replaceAll("[^a-zA-Z0-9_\\-]", "_");
            Path carpetaCliente = carpetaClientes.resolve(nombreSeguroCliente);
            Files.createDirectories(carpetaCliente);

            // 📁 Carpeta del técnico
            Path carpetaTecnicoHistorial = carpetaTecnicos.resolve(tecnicoFolderName);
            Files.createDirectories(carpetaTecnicoHistorial);

            // 1️⃣ obtener solo los PDFs del técnico logueado
            List<Path> pdfs = Files.list(tecnicoFolder)
                    .filter(Files::isRegularFile)
                    .filter(p -> p.toString().endsWith(".pdf"))
                    .toList();

            if (pdfs.isEmpty()) {
                return "No hay informes pendientes para este técnico.";
            }

            // 2️⃣ Enviar correo con SOLO los PDFs del técnico
            emailService.enviarInformeMultiplePdf(
                    correoCliente,
                    "Informe de visita completada",
                    "Adjunto encontrará los informes del técnico " + tecnico.getNombre(),
                    pdfs
            );

            String fecha = LocalDate.now().toString(); // YYYY-MM-DD

            // 📥 Procesar PDFs
            for (Path pdf : pdfs) {

                // 1️⃣ Obtener consecutivo desde el nombre original del archivo
                String originalFileName = pdf.getFileName().toString();  // ej: 12345.pdf
                String consecutivo = originalFileName.replace(".pdf", ""); // ej: 12345

                // 2️⃣ Crear nombres finales
                String filenameCliente =
                        tecnicoFolderName + "+" + consecutivo + "+" + fecha + ".pdf";

                String filenameTecnico =
                        nombreSeguroCliente + "+" + consecutivo + "+" + fecha + ".pdf";

                // 3️⃣ Mover PDF al historial del cliente
                Files.move(pdf, carpetaCliente.resolve(filenameCliente),
                        StandardCopyOption.REPLACE_EXISTING);

                // 4️⃣ Copiar PDF al historial del técnico
                Files.copy(
                        carpetaCliente.resolve(filenameCliente),
                        carpetaTecnicoHistorial.resolve(filenameTecnico),
                        StandardCopyOption.REPLACE_EXISTING
                );
            }
            return "✅ Informes enviados y movidos: Técnico = " + tecnico.getNombre();

        } catch (IOException e) {
            throw new RuntimeException("Error al mover o enviar los informes", e);
        }
    }



    public String getNextConsecutivo() {
        return generarConsecutivo();
    }

}
