package com.devs.TechTraking.controllers;

import com.devs.TechTraking.model.Revision;
import com.devs.TechTraking.service.InformeService;
import com.devs.TechTraking.service.RevisionService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;

@RestController
@RequestMapping("/tecnico")
@CrossOrigin(origins = "*")
public class InformeController {

    private final RevisionService revisionService;
    private final InformeService informeService; // ✅ Cambiado

    // ✅ Constructor con el nombre correcto
    public InformeController(RevisionService revisionService,
                             InformeService informeService) {
        this.revisionService = revisionService;
        this.informeService = informeService;
    }

    @GetMapping("/informe/{id}")
    public ResponseEntity<byte[]> generarReporte(@PathVariable Long id) throws IOException {
        Revision revision = revisionService.getRevisionById(id);
        if (revision == null) {
            return ResponseEntity.notFound().build();
        }

        // ✅ Llamada al método public
        ByteArrayInputStream bis = informeService.generarReporte(revision);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=informe_revision_" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(bis.readAllBytes());
    }

}
