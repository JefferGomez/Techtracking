package com.devs.TechTraking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.nio.file.Path;
import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarInformeMultiplePdf(String destinatario, String asunto, String cuerpo, List<Path> pdfPaths) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true);

            helper.setTo(destinatario);
            helper.setSubject(asunto);
            helper.setText(cuerpo);

            // Adjuntar todos los PDFs
            for (Path pdfPath : pdfPaths) {
                FileSystemResource file = new FileSystemResource(pdfPath.toFile());
                helper.addAttachment(file.getFilename(), file);
            }

            mailSender.send(mensaje);
            System.out.println("✅ Correo enviado exitosamente con " + pdfPaths.size() + " PDFs a " + destinatario);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error al enviar los correos: " + e.getMessage());
        }
    }
}
