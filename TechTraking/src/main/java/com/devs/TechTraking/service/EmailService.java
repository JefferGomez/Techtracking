package com.devs.TechTraking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.io.ByteArrayInputStream;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarInformePdf(String destinatario, String asunto, String cuerpo, ByteArrayInputStream pdfStream) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true);

            helper.setTo(destinatario);
            helper.setSubject(asunto);
            helper.setText(cuerpo);

            // Adjuntamos el PDF
            InputStreamSource fuente = () -> pdfStream;
            helper.addAttachment("informe_revision.pdf", fuente);

            mailSender.send(mensaje);
            System.out.println("✅ Correo enviado exitosamente a " + destinatario);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error al enviar el correo: " + e.getMessage());
        }
    }
}
