package com.devs.TechTraking.service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;


@Service
public class EnviarCorreoService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend.reset-password-url}")
    private String urlFrontEnd;

    public EnviarCorreoService(JavaMailSender mailSender){

        this.mailSender = mailSender;

    }

    public void EnviarCorreoRecuperacion(String destino, String token){

        String encodedToken = URLEncoder.encode(token, StandardCharsets.UTF_8);
        String link = urlFrontEnd + "?token="+ encodedToken;

        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(destino);
        mensaje.setSubject("Recuperación Contraseña TechTracking");
        mensaje.setText("Has click en el siguiente enlace para cambiar tu contraseña \n "+link);
        mailSender.send(mensaje);



    }

    public void EnviarInformacionUsuario(String destino,String nombre,String correo,
                                         String rol,String contrasenaTemporal){


        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(destino);
        mensaje.setSubject("Bienvenido a TechTracking");

        String cuerpo = "Hola " + nombre + ",\n\n"
                + "Tu usuario ha sido creado exitosamente en TechTracking.\n\n"
                + "📌 Credenciales de acceso:\n"
                + "Usuario: " + correo + "\n"
                + "Contraseña temporal: " + contrasenaTemporal + "\n"
                + "Rol asignado: " + rol + "\n\n"
                + "Por seguridad, deberás cambiar tu contraseña en el primer inicio de sesión.\n\n"
                + "Saludos,\nEquipo TechTracking";

        mensaje.setText(cuerpo);
        mailSender.send(mensaje);


    }


}
