package com.devs.TechTraking.controllers;

import com.devs.TechTraking.model.Usuarios;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ChatController {

    @GetMapping("/chat-page")
    public String showChatPage(Model model, Authentication authentication) {
        // Obtener el usuario autenticado desde la sesión
        if (authentication != null && authentication.getPrincipal() instanceof Usuarios) {
            Usuarios usuario = (Usuarios) authentication.getPrincipal();

            // Pasar el nombre completo al modelo
            model.addAttribute("nombreUsuario", usuario.getNombre());
            model.addAttribute("correoUsuario", usuario.getCorreo());
        } else {
            // Fallback en caso de que no haya usuario autenticado
            model.addAttribute("nombreUsuario", "Usuario");
            model.addAttribute("correoUsuario", "");
        }

        return "chat";
    }

    @GetMapping("/chat-fragment")
    public String getChatFragment(Model model, Authentication authentication) {
        // Obtener el usuario autenticado desde la sesión
        if (authentication != null && authentication.getPrincipal() instanceof Usuarios) {
            Usuarios usuario = (Usuarios) authentication.getPrincipal();

            // Pasar el nombre completo al modelo
            model.addAttribute("nombreUsuario", usuario.getNombre());
            model.addAttribute("correoUsuario", usuario.getCorreo());
        } else {
            // Fallback en caso de que no haya usuario autenticado
            model.addAttribute("nombreUsuario", "Usuario");
            model.addAttribute("correoUsuario", "");
        }

        return "chat-fragment";
    }
}
