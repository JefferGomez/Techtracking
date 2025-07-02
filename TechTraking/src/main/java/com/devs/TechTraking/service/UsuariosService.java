package com.devs.TechTraking.service;

import com.devs.TechTraking.model.Usuarios;
import com.devs.TechTraking.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.List;
import java.util.Optional;


@Service
public class UsuariosService implements UserDetailsService{



    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;



    public List<Usuarios> obtenerUsuarios(){

        return usuarioRepository.findAll();

    }

    public Usuarios crearUsuarios(Usuarios usuarios){

         String contraseñaCodificada = passwordEncoder.encode(usuarios.getContraseña());
         usuarios.setContraseña(contraseñaCodificada);
         return usuarioRepository.save(usuarios);

    }

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        Usuarios usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con correo: " + correo));


        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(usuario.getRol().getNombre().name());

        return usuario;
    }

    public Optional<Usuarios> editarUsuario(Integer id, Usuarios datosActualizados) {
        Optional<Usuarios> optionalUsuario = usuarioRepository.findById(id);

        if (optionalUsuario.isPresent()) {
            Usuarios usuarioExistente = optionalUsuario.get();

            // Solo actualizamos correo y contraseña
            usuarioExistente.setCorreo(datosActualizados.getCorreo());
            usuarioExistente.setContraseña(passwordEncoder.encode(datosActualizados.getContraseña()));

            usuarioRepository.save(usuarioExistente);
            return Optional.of(usuarioExistente);
        } else {
            return Optional.empty();
        }
    }

    public boolean eliminarUsuario(Integer id){

        Optional<Usuarios> usuario = usuarioRepository.findById(id);

        if (usuario.isPresent()){

            usuarioRepository.deleteById(id);
            return true;

        }else{

            return false;

        }



    }



}





