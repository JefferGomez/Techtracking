package com.devs.TechTraking.config;
import com.devs.TechTraking.security.FailureHandler;
import com.devs.TechTraking.security.SuccesHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.security.config.http.SessionCreationPolicy;






@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final FailureHandler failureHandler;
    private final SuccesHandler succesHandler;

    public SecurityConfig(FailureHandler failureHandler, SuccesHandler succesHandler) {
        this.failureHandler = failureHandler;
        this.succesHandler = succesHandler;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{

       return http
               .csrf(AbstractHttpConfigurer::disable)
               .sessionManagement(session -> session
                       .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                       .maximumSessions(10) // Permite múltiples sesiones por usuario
                       .maxSessionsPreventsLogin(false) // No previene login si hay sesiones activas
                       .sessionRegistry(sessionRegistry()) // Necesitarás crear este bean
               )
               // Configuración de logout mejorada (opcional)
               .logout(logout -> logout
                       .logoutUrl("/logout")
                       .logoutSuccessUrl("/?logout")
                       .invalidateHttpSession(true)
                       .deleteCookies("JSESSIONID")
                       .clearAuthentication(true)
               )
               .authorizeHttpRequests(authRequest ->
                       authRequest
                               .requestMatchers("/", "/css/**", "/js/**", "/img/**", "/auth/**").permitAll()
                               .requestMatchers("/admin/**").hasAuthority("ADMIN")
                               .requestMatchers("/tecnico/**").hasAuthority("TECNICO")
                               .requestMatchers("/almacenista/**").hasAuthority("ALMACENISTA")
                               .requestMatchers("/superadmin/**").hasAuthority("SUPERADMIN")
                               .requestMatchers("/chat-page/**").hasAnyAuthority("ADMIN","TECNICO","ALMACENISTA")
                               .anyRequest().authenticated()
               )

               .formLogin(form -> form
                       .loginPage("/")
                       .loginProcessingUrl("/procesarLogin")
                       .failureHandler(failureHandler)
                       .usernameParameter("correo")
                       .passwordParameter("contraseña")
                       .successHandler(succesHandler)
                       .permitAll()
               )
               .build();

    }

    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }

    @Bean
    public HttpSessionEventPublisher httpSessionEventPublisher() {
        return new HttpSessionEventPublisher();
    }


}

