package com.devs.TechTraking.config;
import com.devs.TechTraking.enums.NombreRol;
import com.devs.TechTraking.model.Rol;
import com.devs.TechTraking.model.Usuarios;
import com.devs.TechTraking.repository.RolRepository;
import com.devs.TechTraking.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;


@Configuration
public class SuperAdminInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        String correoSuperAdmin = "superadmin@prueba.com";


        if (usuarioRepository.findByCorreo(correoSuperAdmin).isEmpty()) {
            Rol rolSuperAdmin = rolRepository.findByNombre(NombreRol.SUPERADMIN)
                    .orElseThrow(() -> new RuntimeException("El rol SUPERADMIN no está en la base de datos."));

            Usuarios superadmin = new Usuarios();
            superadmin.setId(1);
            superadmin.setNombre("Super Admin");
            superadmin.setCorreo(correoSuperAdmin);
            superadmin.setContraseña(passwordEncoder.encode("superadmin123"));
            superadmin.setRol(rolSuperAdmin);

            usuarioRepository.save(superadmin);

            System.out.println("✅ SuperAdmin creado automáticamente.");
        } else {
            System.out.println("ℹ️ El SuperAdmin ya existe. No se creó uno nuevo.");
        }
    }

}
