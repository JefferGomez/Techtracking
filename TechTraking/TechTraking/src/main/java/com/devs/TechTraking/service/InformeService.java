package com.devs.TechTraking.service;

import com.devs.TechTraking.model.Revision;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.*;

@Service
public class InformeService {

    public ByteArrayInputStream generarReporte(Revision revision) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // 📌 Título
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20);
            Paragraph title = new Paragraph("Informe de Revisión", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(Chunk.NEWLINE);

            // 📌 Datos generales
            document.add(new Paragraph("Cliente ID: " + revision.getCliente()));
            document.add(new Paragraph("Equipo ID: " + revision.getEquipo()));
            document.add(new Paragraph("Fecha de Revisión: " + revision.getFecha()));
            document.add(Chunk.NEWLINE);

            // 📌 Configuración
            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);

            Map<String, Boolean> criterios = getCriterios();
            Map<String, String> preguntas = getPreguntas();
            Map<String, Boolean> respuestas = RevisionMapperUtil.toMap(revision);

            // 📌 Diccionario de observaciones automáticas
            Map<String, String> observacionesAuto = getObservacionesAuto();

            // 📌 Definición de secciones
            Map<String, String[]> secciones = Map.of(
                    "Estado General", new String[]{"equipoEnciende", "estaOperando", "estaPartido", "estaManchado"},
                    "Piezas Faltantes", new String[]{"tornillos", "tapas", "display", "tarjetasElectronicas", "botones", "cabezal"},
                    "Parte Mecánica", new String[]{"oxido", "ruidos", "piñoneriaEnBuenEstado", "correasEnBuenEstado"},
                    "Pantalla", new String[]{"funciona", "partida", "lineasQuemadas", "quemada"},
                    "Cabezal de Impresión", new String[]{"bueno", "lineasBlancas", "calibrado", "limpio"},
                    "Rodillo de Impresión", new String[]{"buenos", "picados", "rayados", "adhesivo"},
                    "Estado Electrónico", new String[]{"humedad", "tarjetaElectronica"}
            );

            boolean hayNegativas = false;

            // 📌 Recorremos secciones
            for (Map.Entry<String, String[]> seccion : secciones.entrySet()) {
                String nombreSeccion = seccion.getKey();
                String[] campos = seccion.getValue();

                // Título de la sección
                Paragraph secTitle = new Paragraph(nombreSeccion, sectionFont);
                secTitle.setSpacingBefore(10);
                secTitle.setSpacingAfter(5);
                document.add(secTitle);

                // Tabla con 2 columnas
                PdfPTable table = new PdfPTable(2);
                table.setWidthPercentage(100);
                table.setSpacingBefore(5);

                // Encabezados
                PdfPCell cell1 = new PdfPCell(new Phrase("Pregunta", headerFont));
                cell1.setBackgroundColor(BaseColor.LIGHT_GRAY);
                table.addCell(cell1);

                PdfPCell cell2 = new PdfPCell(new Phrase("Resultado", headerFont));
                cell2.setBackgroundColor(BaseColor.LIGHT_GRAY);
                table.addCell(cell2);

                boolean seccionTieneNegativas = false;

                for (String campo : campos) {
                    Boolean valor = respuestas.get(campo);
                    Boolean esperado = criterios.get(campo);

                    if (valor != null && esperado != null) {
                        if (!valor.equals(esperado)) { // ❌ Negativo
                            hayNegativas = true;
                            seccionTieneNegativas = true;

                            table.addCell(preguntas.get(campo));

                            // 📌 Mostrar ❌ + observación automática dentro de la tabla
                            String resultado = "❌";
                            if (observacionesAuto.containsKey(campo)) {
                                resultado += " " + observacionesAuto.get(campo);
                            }
                            table.addCell(resultado);
                        }
                    }
                }

                if (!seccionTieneNegativas) {
                    PdfPCell cell = new PdfPCell(new Phrase("✅ Sin observaciones negativas en esta sección"));
                    cell.setColspan(2);
                    cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                    table.addCell(cell);
                }

                document.add(table);
            }

            if (!hayNegativas) {
                Paragraph ok = new Paragraph("✅ El equipo pasó todas las verificaciones sin observaciones negativas", sectionFont);
                ok.setSpacingBefore(15);
                document.add(ok);
            }

            document.add(Chunk.NEWLINE);

            // 📌 Observaciones manuales
            document.add(new Paragraph("Observaciones del técnico:", sectionFont));
            document.add(new Paragraph(revision.getObservaciones()));

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    // 📌 Diccionario de observaciones automáticas
    private Map<String, String> getObservacionesAuto() {
        return Map.ofEntries(
                // Estado General
                Map.entry("equipoEnciende", "El equipo no enciende, revisar fuente de alimentación."),
                Map.entry("estaOperando", "El equipo no está operando correctamente."),
                Map.entry("estaPartido", "El equipo presenta daños estructurales (partido)."),
                Map.entry("estaManchado", "El equipo presenta manchas o suciedad visible."),

                // Piezas Faltantes
                Map.entry("tornillos", "Faltan tornillos, riesgo de fijación inadecuada."),
                Map.entry("tapas", "Faltan tapas, riesgo de exposición de componentes."),
                Map.entry("display", "El display no funciona correctamente."),
                Map.entry("tarjetasElectronicas", "Faltan tarjetas electrónicas, revisar integridad del sistema."),
                Map.entry("botones", "Botones en mal estado o faltantes."),
                Map.entry("cabezal", "Cabezal ausente o defectuoso."),

                // Parte Mecánica
                Map.entry("oxido", "Se encontró óxido en la estructura."),
                Map.entry("ruidos", "Se detectaron ruidos anormales en la operación."),
                Map.entry("piñoneriaEnBuenEstado", "La piñonería presenta desgaste."),
                Map.entry("correasEnBuenEstado", "Las correas presentan desgaste o roturas."),

                // Pantalla
                Map.entry("funciona", "La pantalla no enciende."),
                Map.entry("partida", "La pantalla está partida."),
                Map.entry("lineasQuemadas", "Se observan líneas quemadas en la pantalla."),
                Map.entry("quemada", "La pantalla está completamente quemada."),

                // Cabezal de Impresión
                Map.entry("bueno", "El cabezal de impresión no está en buen estado."),
                Map.entry("lineasBlancas", "Se observan líneas blancas en las impresiones."),
                Map.entry("calibrado", "El cabezal no está calibrado."),
                Map.entry("limpio", "El cabezal no está limpio."),

                // Rodillo de Impresión
                Map.entry("buenos", "Los rodillos no están en buen estado."),
                Map.entry("picados", "Los rodillos presentan picaduras."),
                Map.entry("rayados", "Los rodillos están rayados."),
                Map.entry("adhesivo", "Exceso de adhesivo en los rodillos."),

                // Estado Electrónico
                Map.entry("humedad", "Se detectó humedad en el sistema, riesgo eléctrico."),
                Map.entry("tarjetaElectronica", "La tarjeta electrónica no responde correctamente.")
        );
    }

    // 📌 Map con preguntas legibles
    private Map<String, String> getPreguntas() {
        return Map.ofEntries(
                Map.entry("equipoEnciende", "¿El equipo enciende?"),
                Map.entry("estaOperando", "¿El equipo está operando?"),
                Map.entry("estaPartido", "¿El equipo está partido?"),
                Map.entry("estaManchado", "¿El equipo está manchado?"),
                Map.entry("tornillos", "¿Faltan tornillos?"),
                Map.entry("tapas", "¿Faltan tapas?"),
                Map.entry("display", "¿El display funciona?"),
                Map.entry("tarjetasElectronicas", "¿Faltan tarjetas electrónicas?"),
                Map.entry("botones", "¿Los botones funcionan?"),
                Map.entry("cabezal", "¿El cabezal está presente y en buen estado?"),
                Map.entry("oxido", "¿Presenta óxido?"),
                Map.entry("ruidos", "¿Presenta ruidos anormales?"),
                Map.entry("piñoneriaEnBuenEstado", "¿La piñonería está en buen estado?"),
                Map.entry("correasEnBuenEstado", "¿Las correas están en buen estado?"),
                Map.entry("funciona", "¿La pantalla funciona?"),
                Map.entry("partida", "¿La pantalla está partida?"),
                Map.entry("lineasQuemadas", "¿La pantalla tiene líneas quemadas?"),
                Map.entry("quemada", "¿La pantalla está quemada?"),
                Map.entry("bueno", "¿El cabezal está en buen estado?"),
                Map.entry("lineasBlancas", "¿El cabezal tiene líneas blancas?"),
                Map.entry("calibrado", "¿El cabezal está calibrado?"),
                Map.entry("limpio", "¿El cabezal está limpio?"),
                Map.entry("buenos", "¿Los rodillos están en buen estado?"),
                Map.entry("picados", "¿Los rodillos están picados?"),
                Map.entry("rayados", "¿Los rodillos están rayados?"),
                Map.entry("adhesivo", "¿Hay exceso de adhesivo en los rodillos?"),
                Map.entry("humedad", "¿Se detecta humedad en el sistema?"),
                Map.entry("tarjetaElectronica", "¿La tarjeta electrónica funciona correctamente?")
        );
    }

    // 📌 Valores esperados (true = positivo, false = negativo)
    private Map<String, Boolean> getCriterios() {
        return Map.ofEntries(
                // Estado General
                Map.entry("equipoEnciende", true),
                Map.entry("estaOperando", true),
                Map.entry("estaPartido", false),
                Map.entry("estaManchado", false),

                // Piezas Faltantes
                Map.entry("tornillos", false),
                Map.entry("tapas", false),
                Map.entry("display", true),
                Map.entry("tarjetasElectronicas", false),
                Map.entry("botones", true),
                Map.entry("cabezal", true),

                // Parte Mecánica
                Map.entry("oxido", false),
                Map.entry("ruidos", false),
                Map.entry("piñoneriaEnBuenEstado", true),
                Map.entry("correasEnBuenEstado", true),

                // Pantalla
                Map.entry("funciona", true),
                Map.entry("partida", false),
                Map.entry("lineasQuemadas", false),
                Map.entry("quemada", false),

                // Cabezal de Impresión
                Map.entry("bueno", true),
                Map.entry("lineasBlancas", false),
                Map.entry("calibrado", true),
                Map.entry("limpio", true),

                // Rodillo de Impresión
                Map.entry("buenos", true),
                Map.entry("picados", false),
                Map.entry("rayados", false),
                Map.entry("adhesivo", false),

                // Estado Electrónico
                Map.entry("humedad", false),
                Map.entry("tarjetaElectronica", true)
        );
    }

    // 📌 Mapper utilitario
    public static class RevisionMapperUtil {
        public static Map<String, Boolean> toMap(Revision revision) {
            return Map.ofEntries(
                    Map.entry("equipoEnciende", revision.isEquipoEnciende()),
                    Map.entry("estaOperando", revision.isEstaOperando()),
                    Map.entry("estaPartido", revision.isEstaPartido()),
                    Map.entry("estaManchado", revision.isEstaManchado()),
                    Map.entry("tornillos", revision.isTornillos()),
                    Map.entry("tapas", revision.isTapas()),
                    Map.entry("display", revision.isDisplay()),
                    Map.entry("tarjetasElectronicas", revision.isTarjetasElectronicas()),
                    Map.entry("botones", revision.isBotones()),
                    Map.entry("cabezal", revision.isCabezal()),
                    Map.entry("oxido", revision.isOxido()),
                    Map.entry("ruidos", revision.isRuidos()),
                    Map.entry("piñoneriaEnBuenEstado", revision.isPiñoneriaEnBuenEstado()),
                    Map.entry("correasEnBuenEstado", revision.isCorreasEnBuenEstado()),
                    Map.entry("funciona", revision.isFunciona()),
                    Map.entry("partida", revision.isPartida()),
                    Map.entry("lineasQuemadas", revision.isLineasQuemadas()),
                    Map.entry("quemada", revision.isQuemada()),
                    Map.entry("bueno", revision.isBueno()),
                    Map.entry("lineasBlancas", revision.isLineasBlancas()),
                    Map.entry("calibrado", revision.isCalibrado()),
                    Map.entry("limpio", revision.isLimpio()),
                    Map.entry("buenos", revision.isBuenos()),
                    Map.entry("picados", revision.isPicados()),
                    Map.entry("rayados", revision.isRayados()),
                    Map.entry("adhesivo", revision.isAdhesivo()),
                    Map.entry("humedad", revision.isHumedad()),
                    Map.entry("tarjetaElectronica", revision.isTarjetaElectronica())
            );
        }
    }
}
