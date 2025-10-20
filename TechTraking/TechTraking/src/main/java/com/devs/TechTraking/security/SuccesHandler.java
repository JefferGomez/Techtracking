package com.devs.TechTraking.security;

import com.devs.TechTraking.jwt.JwtUtil;
import com.devs.TechTraking.model.Usuarios;
import com.devs.TechTraking.service.UsuariosService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class SuccesHandler implements AuthenticationSuccessHandler {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuariosService usuariosService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                       HttpServletResponse response,
                                       Authentication authentication)
        throws IOException, ServletException{

        Usuarios usuario = (Usuarios) authentication.getPrincipal();

        try {
            usuariosService.actualizarUltimaSesion(usuario.getId());
            System.out.println("Ultima sesión registrada para usuario: "+ usuario.getCorreo());
        } catch (Exception e) {
            System.err.println("Error al registrar ultima sesión: " + e.getMessage());
        }

        if (usuario.isContraseñaTemporal()){

            String token= jwtUtil.generarToken(usuario.getCorreo(), 10);
            response.sendRedirect("/auth/cambiarContrasena?token="+token);
            return;
        }

        String rol = authentication.getAuthorities().iterator().next().getAuthority();

        switch (rol) {
            case "SUPERADMIN":
                response.sendRedirect("/superadmin/Usuarios");
                break;
            case "ADMIN":
                response.sendRedirect("/admin");
                break;
            case "TECNICO":
                response.sendRedirect("/tecnico");
                break;
            case "ALMACENISTA":
                response.sendRedirect("/chat-page");
                break;
            default:
                response.sendRedirect("/"); // Por si acaso
                break;
        }

    }

}
