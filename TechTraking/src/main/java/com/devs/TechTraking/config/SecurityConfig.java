package com.devs.TechTraking.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;



@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{

       return http
               .csrf(AbstractHttpConfigurer::disable)
               .authorizeHttpRequests(authRequest ->
                       authRequest
                               .requestMatchers("/","/css/**", "/js/**","/img/**","/CorreoRecuperar").permitAll()
                               .requestMatchers("/admin/**").hasAuthority("ADMIN")
                               .requestMatchers("/tecnico/**").hasAuthority("TECNICO")
                               .requestMatchers("/almacenista/**").hasAuthority("ALMACENISTA")
                               .requestMatchers("/superadmin/**").hasAuthority("SUPERADMIN")
                               .anyRequest().authenticated()
                        )
               .formLogin(form -> form
                       .loginPage("/")
                       .loginProcessingUrl("/")
                       .failureUrl("/errorAutenticacion")
                       .usernameParameter("correo")
                       .passwordParameter("contraseña")
                       .defaultSuccessUrl("/redireccionar", true)
                       .permitAll()
               )
               .build();

    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
