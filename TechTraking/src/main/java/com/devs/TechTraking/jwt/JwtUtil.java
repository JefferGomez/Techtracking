package com.devs.TechTraking.jwt;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;

public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private int expiration;


    public String generateToken(Authentication authentication){

    }


}
