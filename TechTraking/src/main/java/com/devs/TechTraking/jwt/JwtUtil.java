package com.devs.TechTraking.jwt;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Date;


@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    public String generarToken(String correo, int minutosExpiracion){

        Date ahora = new Date();
        Date expiracion = new Date(ahora.getTime() + minutosExpiracion * 60 * 1000);

        return Jwts.builder()
                .setSubject(correo)
                .setIssuedAt(ahora)
                .setExpiration(expiracion)
                .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)), SignatureAlgorithm.HS256)
                .compact();
    }


    public String obtenerCorreoToken(String token){

        return Jwts.parser().setSigningKey(jwtSecret.getBytes(StandardCharsets.UTF_8)).parseClaimsJws(token).getBody().getSubject();

    }

    public boolean validarToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret.getBytes(StandardCharsets.UTF_8)).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

}
