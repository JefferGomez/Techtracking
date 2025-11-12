package com.devs.TechTraking.service;

import com.devs.TechTraking.model.Revision;
import com.devs.TechTraking.repository.RevisionRepository;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;

@Service
public class RevisionService {

    private final RevisionRepository revisionRepository;
    private final InformeService informeService;
    private final EmailService emailService;

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
        Path tempFolder = Paths.get("temp-pdfs");
        Path registrosFolder = Paths.get("registros");

        try {
            if (!Files.exists(tempFolder)) {
                return "No hay informes pendientes.";
            }

            // Normalizar el nombre del cliente para usarlo en la carpeta
            String nombreSeguro = nombreCliente.replaceAll("[^a-zA-Z0-9_\\-]", "_");

            // Crear carpeta del cliente dentro de registros
            Path carpetaCliente = registrosFolder.resolve(nombreSeguro);
            Files.createDirectories(carpetaCliente);

            // 1️⃣ Obtener todos los PDFs en la carpeta temporal
            List<Path> pdfs = Files.list(tempFolder)
                    .filter(Files::isRegularFile)
                    .filter(p -> p.toString().endsWith(".pdf"))
                    .toList();

            if (pdfs.isEmpty()) {
                return "No hay informes pendientes para enviar.";
            }

            // 2️⃣ Enviar correo con todos los PDFs
            emailService.enviarInformeMultiplePdf(
                    correoCliente,
                    "Informe de visita completada",
                    "Adjunto encontrará los informes de todos los equipos visitados.",
                    pdfs
            );

            // 3️⃣ Mover los archivos a la carpeta del cliente dentro de registros
            for (Path pdf : pdfs) {
                Path destino = carpetaCliente.resolve(pdf.getFileName());
                Files.move(pdf, destino, StandardCopyOption.REPLACE_EXISTING);
            }

            return "✅ Informes enviados y movidos a la carpeta del cliente: " + nombreSeguro;

        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Error procesando los informes.", e);
        }
    }


    public String getNextConsecutivo() {
        return generarConsecutivo();
    }

}
