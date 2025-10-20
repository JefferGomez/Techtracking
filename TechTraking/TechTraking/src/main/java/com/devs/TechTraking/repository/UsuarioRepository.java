package com.devs.TechTraking.repository;

import com.devs.TechTraking.model.Usuarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;


@Repository
public interface UsuarioRepository extends JpaRepository<Usuarios,Integer> {

    Optional<Usuarios> findByCorreo(String correo);

    @Modifying
    @Query("UPDATE Usuarios u SET u.ultimaSesion = :fechaHora WHERE u.id = :usuarioId")
    void actualizarUltimaSesion(@Param("usuarioId") Integer usuarioId,
                                @Param("fechaHora") LocalDateTime fechaHora);


}
