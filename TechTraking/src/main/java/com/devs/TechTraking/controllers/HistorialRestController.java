package com.devs.TechTraking.controllers;


import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/admin")
public class HistorialRestController {


    @GetMapping("/registros")
    public ResponseEntity<List<Map<String, Object>>> listarRegistros() {
        Path registrosPath = Paths.get("registros");
        List<Map<String, Object>> resultado = new ArrayList<>();

        try {
            if (!Files.exists(registrosPath)) {
                return ResponseEntity.ok(Collections.emptyList());
            }

            Files.list(registrosPath)
                    .filter(Files::isDirectory)
                    .forEach(carpeta -> {
                        try {
                            List<String> archivos = Files.list(carpeta)
                                    .filter(Files::isRegularFile)
                                    .filter(f -> f.toString().endsWith(".pdf"))
                                    .map(f -> f.getFileName().toString())
                                    .toList();

                            Map<String, Object> clienteInfo = new HashMap<>();
                            clienteInfo.put("cliente", carpeta.getFileName().toString());
                            clienteInfo.put("cantidadArchivos", archivos.size());
                            clienteInfo.put("archivos", archivos);

                            resultado.add(clienteInfo);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    });

            return ResponseEntity.ok(resultado);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/registros/{cliente}/{archivo}")
    public ResponseEntity<Resource> descargarArchivo(
            @PathVariable String cliente,
            @PathVariable String archivo) {

        try {
            Path filePath = Paths.get("registros", cliente, archivo);

            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(filePath.toUri());

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + archivo + "\"")
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }




}
