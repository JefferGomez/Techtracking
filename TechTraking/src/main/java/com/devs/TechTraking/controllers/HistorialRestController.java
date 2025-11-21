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

        // Nueva ruta correcta
        Path registrosClientesPath = Paths.get("registros", "clientes");
        List<Map<String, Object>> resultado = new ArrayList<>();

        try {
            if (!Files.exists(registrosClientesPath)) {
                return ResponseEntity.ok(Collections.emptyList());
            }

            // Recorre SOLO carpetas de clientes
            Files.list(registrosClientesPath)
                    .filter(Files::isDirectory)
                    .forEach(carpetaCliente -> {
                        try {
                            List<String> archivos = Files.list(carpetaCliente)
                                    .filter(Files::isRegularFile)
                                    .filter(f -> f.toString().endsWith(".pdf"))
                                    .map(f -> f.getFileName().toString())
                                    .toList();

                            Map<String, Object> info = new HashMap<>();
                            info.put("cliente", carpetaCliente.getFileName().toString());
                            info.put("cantidadArchivos", archivos.size());
                            info.put("archivos", archivos);

                            resultado.add(info);

                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    });

            return ResponseEntity.ok(resultado);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/registros/{cliente}/{archivo}")
    public ResponseEntity<Resource> descargarArchivo(
            @PathVariable String cliente,
            @PathVariable String archivo) {

        try {
            Path filePath = Paths.get("registros", "clientes", cliente, archivo);

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


    @GetMapping("/registros/tecnicos")
    public ResponseEntity<List<Map<String, Object>>> listarRegistrosTecnicos() {

        Path pathTecnicos = Paths.get("registros", "tecnicos");
        List<Map<String, Object>> resultado = new ArrayList<>();

        try {
            if (!Files.exists(pathTecnicos)) {
                return ResponseEntity.ok(Collections.emptyList());
            }

            Files.list(pathTecnicos)
                    .filter(Files::isDirectory)
                    .forEach(carpeta -> {
                        try {
                            List<String> archivos = Files.list(carpeta)
                                    .filter(Files::isRegularFile)
                                    .filter(f -> f.toString().endsWith(".pdf"))
                                    .map(f -> f.getFileName().toString())
                                    .toList();

                            Map<String, Object> info = new HashMap<>();
                            info.put("tecnico", carpeta.getFileName().toString());
                            info.put("cantidadArchivos", archivos.size());
                            info.put("archivos", archivos);

                            resultado.add(info);

                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    });

            return ResponseEntity.ok(resultado);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }


    @GetMapping("/registros/tecnicos/{tecnico}/{archivo}")
    public ResponseEntity<Resource> descargarArchivoTecnico(
            @PathVariable String tecnico,
            @PathVariable String archivo) {

        try {
            Path filePath = Paths.get("registros", "tecnicos", tecnico, archivo);

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
