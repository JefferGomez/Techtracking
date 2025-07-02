package com.devs.TechTraking.config;


import com.devs.TechTraking.security.FailureHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;



@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final FailureHandler failureHandler;

    public SecurityConfig(FailureHandler failureHandler) {
        this.failureHandler = failureHandler;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{

       return http
               .csrf(AbstractHttpConfigurer::disable)
               .authorizeHttpRequests(authRequest ->
                       authRequest
                               .requestMatchers("/","/css/**", "/js/**","/img/**","/auth/**").permitAll()
                               .requestMatchers("/admin/**").hasAuthority("ADMIN")
                               .requestMatchers("/tecnico/**").hasAuthority("TECNICO")
                               .requestMatchers("/almacenista/**").hasAuthority("ALMACENISTA")
                               .requestMatchers("/superadmin/**").hasAuthority("SUPERADMIN")
                               .anyRequest().authenticated()
                        )
               .formLogin(form -> form
                       .loginPage("/")
                       .loginProcessingUrl("/procesarLogin")
                       .failureHandler(failureHandler)
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
