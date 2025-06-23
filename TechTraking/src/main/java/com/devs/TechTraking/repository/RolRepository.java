package com.devs.TechTraking.repository;
import com.devs.TechTraking.enums.NombreRol;
import com.devs.TechTraking.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;



public interface RolRepository extends JpaRepository<Rol,Integer> {

    Optional<Rol> findByNombre(NombreRol nombre);


}
