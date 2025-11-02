package com.devs.TechTraking.service;

import com.devs.TechTraking.model.Revision;
import com.devs.TechTraking.repository.RevisionRepository;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.util.List;

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

    public Revision saveRevision(Revision revision) {
        return revisionRepository.save(revision);
    }

    public List<Revision> getAllRevisiones() {
        return revisionRepository.findAll();
    }

    public Revision getRevisionById(Long id) {
        return revisionRepository.findById(id).orElse(null);
    }

    /**
     * Guarda la revisión y envía el informe PDF al correo del cliente.
     */
    public Revision saveRevisionAndSendReport(Revision revision) {
        // Guardar la revisión
        Revision saved = revisionRepository.save(revision);

        try {
            // Generar el PDF del informe
            ByteArrayInputStream pdfStream = informeService.generarReporte(saved);

            // Obtener correo del cliente
            String correoCliente = saved.getCliente().getCorreo();
            if (correoCliente == null || correoCliente.isEmpty()) {
                throw new RuntimeException("El cliente no tiene un correo registrado.");
            }

            // Enviar correo
            String asunto = "Informe de revisión del equipo - " + saved.getEquipo().getMarca();
            String cuerpo = "Estimado(a) " + saved.getCliente().getNombre() +
                    ",\n\nAdjunto encontrará el informe PDF de la revisión realizada al equipo: "
                    + saved.getEquipo().getModelo() + ".\n\nSaludos,\nEquipo Técnico.";

            emailService.enviarInformePdf(correoCliente, asunto, cuerpo, pdfStream);

            System.out.println("✅ Informe enviado exitosamente al correo del cliente.");

        } catch (Exception e) {
            System.err.println("❌ Error al generar o enviar el informe: " + e.getMessage());
        }

        return saved;
    }
}
