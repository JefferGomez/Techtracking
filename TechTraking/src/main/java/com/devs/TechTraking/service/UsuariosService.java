package com.devs.TechTraking.service;

import com.devs.TechTraking.model.Tecnico;
import com.devs.TechTraking.model.Usuarios;
import com.devs.TechTraking.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class UsuariosService implements UserDetailsService{


    @Autowired
    private EnviarCorreoService enviarCorreoService;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;



    public List<Usuarios> obtenerUsuarios(){

        return usuarioRepository.findAll();

    }

    public Usuarios crearUsuarios(Usuarios usuarios){


         String contraseñaTemporal = usuarios.getContraseña();
         String contraseñaCodificada = passwordEncoder.encode(usuarios.getContraseña());
         usuarios.setContraseña(contraseñaCodificada);
         usuarios.setContraseñaTemporal(true);

        if (usuarios.getRol().getId() == 3 && usuarios.getTecnico() != null) {
            usuarios.getTecnico().setUsuario(usuarios);
        }


         Usuarios nuevo = usuarioRepository.save(usuarios);

         String rolNombre=nuevo.getRol().getNombre().name();

         enviarCorreoService.EnviarInformacionUsuario(
                 nuevo.getCorreo(),
                 nuevo.getNombre(),
                 nuevo.getCorreo(),
                 rolNombre,
                 contraseñaTemporal
         );

         return nuevo;

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





