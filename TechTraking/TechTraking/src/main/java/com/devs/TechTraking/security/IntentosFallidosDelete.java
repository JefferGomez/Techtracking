package com.devs.TechTraking.security;
import com.devs.TechTraking.model.Usuarios;
import com.devs.TechTraking.repository.IntentoLoginRepository;
import com.devs.TechTraking.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class IntentosFallidosDelete implements ApplicationListener<AuthenticationSuccessEvent>{




        @Autowired
        UsuarioRepository usuarioRepository;

        @Autowired
        IntentoLoginRepository intentoLoginRepository;

        @Transactional
        @Override
        public void onApplicationEvent(AuthenticationSuccessEvent event) {
            Object principal = event.getAuthentication().getPrincipal();

            if (principal instanceof UserDetails userDetails) {
                String correo = userDetails.getUsername();

                usuarioRepository.findByCorreo(correo).ifPresent(usuario -> {
                    intentoLoginRepository.deleteByUsuarioId(usuario);
                });
            }
        }
    }



