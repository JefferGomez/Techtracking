package com.devs.TechTraking.repository;
import com.devs.TechTraking.model.Intento_login;
import com.devs.TechTraking.model.Usuarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface IntentoLoginRepository extends JpaRepository<Intento_login,Integer> {

    List<Intento_login>  findTop3ByUsuarioIdOrderByFechaDesc(Usuarios usuarios);
    void deleteByUsuarioId(Usuarios usuarios);


}
