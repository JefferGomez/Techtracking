package com.devs.TechTraking.controllers;
import com.devs.TechTraking.jwt.JwtUtil;
import com.devs.TechTraking.model.Usuarios;
import com.devs.TechTraking.repository.UsuarioRepository;
import com.devs.TechTraking.service.EnviarCorreoService;
import com.devs.TechTraking.service.UsuariosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/auth")
public class AuthController {



        @Autowired
        PasswordEncoder passwordEncoder;

        @Autowired
        UsuarioRepository usuarioRepository;

        private final UsuariosService usuariosService;
        private final JwtUtil jwtUtil;
        private final EnviarCorreoService enviarCorreoService;

        public AuthController(UsuariosService usuariosService,JwtUtil jwtUtil,EnviarCorreoService enviarCorreoService){

            this.usuariosService = usuariosService;
            this.jwtUtil = jwtUtil;
            this.enviarCorreoService = enviarCorreoService;

        }


        @PostMapping("/correoRecuperacion")
        public ResponseEntity<?> enviarCorreoRecuperacion(@RequestBody Map<String,String> body){

            String correo = body.get("correo");

            Optional<Usuarios> usuarioOpt = usuarioRepository.findByCorreo(correo);

            if (usuarioOpt.isEmpty()){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Correo No Encontrado");
            }

            String token = jwtUtil.generarToken(correo,10);
            enviarCorreoService.EnviarCorreoRecuperacion(correo,token);

            return ResponseEntity.ok("Correo Enviado");

        }

        @PutMapping("cambiarContraseña")
        public ResponseEntity<?> cambiarContraseña(@RequestBody Map<String,String> body){

            String token = body.get("token");
            String nuevaContraseña = body.get("nuevaContraseña");

            if(!jwtUtil.validarToken(token)){

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token Invalido o Expirado");

            }

            String correo = jwtUtil.obtenerCorreoToken(token);
            Optional<Usuarios> optionalUsuario = usuarioRepository.findByCorreo(correo);

            if (optionalUsuario.isEmpty()){

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario No Encontrado");

            }


            Usuarios usuarios = optionalUsuario.get();
            usuarios.setContraseña(passwordEncoder.encode((nuevaContraseña)));
            usuarios.setBloqueado(false);
            usuarioRepository.save(usuarios);

            return ResponseEntity.ok("Contraseña Actualizada");


        }


}
