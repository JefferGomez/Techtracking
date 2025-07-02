package com.devs.TechTraking.security;
import com.devs.TechTraking.model.Intento_login;
import com.devs.TechTraking.model.Usuarios;
import com.devs.TechTraking.repository.IntentoLoginRepository;
import com.devs.TechTraking.repository.UsuarioRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Component
public class FailureHandler implements AuthenticationFailureHandler {

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    IntentoLoginRepository intentoLoginRepository;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {

        System.out.println("Entró al FailureHandler");

        String correo = request.getParameter("correo");

        if (correo == null) {
            System.out.println("Correo es null. No se pudo procesar.");
            request.getRequestDispatcher("/auth/errorAutenticacion").forward(request, response);
            return;
        }

        Optional<Usuarios> optionalUsuarios = usuarioRepository.findByCorreo(correo);

        if (optionalUsuarios.isPresent()) {
            System.out.println("Usuario encontrado");

            Usuarios usuarios = optionalUsuarios.get();

            Intento_login intentoLogin = new Intento_login();
            intentoLogin.setUsuarioId(usuarios);
            intentoLogin.setFecha(LocalDateTime.now());
            intentoLogin.setExitoso(false);
            intentoLoginRepository.save(intentoLogin);

            List<Intento_login> ultimosIntentos = intentoLoginRepository.findTop3ByUsuarioIdOrderByFechaDesc(usuarios);
            boolean bloquear = ultimosIntentos.size() == 3 && ultimosIntentos.stream().allMatch(i -> !i.getExitoso());

            if (bloquear) {
                usuarios.setBloqueado(true);
                usuarioRepository.save(usuarios);
                System.out.println("Usuario bloqueado. Redirigiendo a intentosFallidos");
                request.getRequestDispatcher("/auth/intentosFallidos").forward(request, response);
                return;
            }

            System.out.println("Menos de 3 intentos. Redirigiendo a errorAutenticacion");
            request.getRequestDispatcher("/auth/errorAutenticacion").forward(request, response);
            return;

        } else {
            System.out.println("Usuario NO encontrado. Redirigiendo a errorAutenticacion");
        }

        request.getRequestDispatcher("/auth/errorAutenticacion").forward(request, response);
    }

}
