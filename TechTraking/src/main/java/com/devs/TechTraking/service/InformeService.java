package com.devs.TechTraking.service;

import com.devs.TechTraking.model.Revision;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

@Service
public class InformeService {

    @Autowired
    private JavaMailSender mailSender;

    public ByteArrayInputStream generarReporte(Revision revision) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20);
            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);

            Paragraph title = new Paragraph("Informe de Revisión", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(Chunk.NEWLINE);

            // Datos generales
            document.add(new Paragraph("Cliente: " + revision.getCliente().getNombre()));
            document.add(new Paragraph("Correo cliente: " + revision.getCliente().getCorreo()));
            document.add(new Paragraph("Equipo: " + revision.getEquipo().getMarca() + " " + revision.getEquipo().getModelo()));
            document.add(new Paragraph("Fecha de revisión: " + revision.getFecha()));
            document.add(new Paragraph(
                    "Tipo de impresora: " + revision.getTipoImpresora()
            ));
            String garantiaTexto = revision.isEquipoGarantia() ? "SI" : "NO";
            document.add(new Paragraph("Garantía: " + garantiaTexto));
            document.add(Chunk.NEWLINE);

            Map<String, Boolean> criterios = getCriterios();
            Map<String, String> preguntas = getPreguntas();
            Map<String, Boolean> respuestas = RevisionMapperUtil.toMap(revision);
            Map<String, String> observacionesAuto = getObservacionesAuto();

            Map<String, String[]> secciones = Map.of(
                    "Garantía", new String[]{"equipoGarantia"},
                    "Estado General", new String[]{"equipoEnciende", "estaOperando", "estaPartido", "estaManchado"},
                    "Piezas Faltantes", new String[]{"tornillos", "tapas", "display", "tarjetasElectronicas", "botones", "cabezal"},
                    "Parte Mecánica", new String[]{"oxido", "ruidos", "piñoneriaEnBuenEstado", "correasEnBuenEstado"},
                    "Pantalla", new String[]{"funciona", "partida", "lineasQuemadas", "quemada"},
                    "Cabezal de Impresión", new String[]{"bueno", "lineasBlancas", "calibrado", "limpio"},
                    "Rodillo de Impresión", new String[]{"buenos", "picados", "rayados", "adhesivo"},
                    "Estado Electrónico", new String[]{"humedad", "tarjetaElectronica"}
            );

            boolean hayNegativas = false;

            for (Map.Entry<String, String[]> seccion : secciones.entrySet()) {
                PdfPTable table = new PdfPTable(2);
                table.setWidthPercentage(100);
                table.setSpacingBefore(5);
                boolean seccionNeg = false;

                for (String campo : seccion.getValue()) {
                    Boolean valor = respuestas.get(campo);
                    Boolean esperado = criterios.get(campo);

                    if (valor != null && esperado != null && !valor.equals(esperado)) {
                        seccionNeg = true;
                        hayNegativas = true;

                        if (table.getRows().isEmpty()) {
                            Paragraph secTitle = new Paragraph(seccion.getKey(), sectionFont);
                            secTitle.setSpacingBefore(10);
                            secTitle.setSpacingAfter(5);
                            document.add(secTitle);

                            PdfPCell c1 = new PdfPCell(new Phrase("Pregunta", headerFont));
                            c1.setBackgroundColor(BaseColor.LIGHT_GRAY);
                            table.addCell(c1);

                            PdfPCell c2 = new PdfPCell(new Phrase("Observación", headerFont));
                            c2.setBackgroundColor(BaseColor.LIGHT_GRAY);
                            table.addCell(c2);
                        }

                        table.addCell(preguntas.get(campo));
                        String obs = observacionesAuto.getOrDefault(campo, "❌ Anomalía detectada");
                        table.addCell("❌ " + obs);
                    }
                }

                if (seccionNeg) {
                    document.add(table);
                }
            }

            // Campos de texto adicionales
            if (revision.getOtroPiezaFaltante() != null && !revision.getOtroPiezaFaltante().isEmpty()) {
                document.add(new Paragraph("🧩 Otro pieza faltante: " + revision.getOtroPiezaFaltante()));
            }
            if (revision.getOtroParteMecanica() != null && !revision.getOtroParteMecanica().isEmpty()) {
                document.add(new Paragraph("⚙️ Otro parte mecánica: " + revision.getOtroParteMecanica()));
            }
            if (revision.getOtroEstadoElectronico() != null && !revision.getOtroEstadoElectronico().isEmpty()) {
                document.add(new Paragraph("💡 Otro estado electrónico: " + revision.getOtroEstadoElectronico()));
            }

            if (!hayNegativas) {
                Paragraph ok = new Paragraph("✅ El equipo pasó todas las verificaciones sin observaciones negativas.", sectionFont);
                ok.setSpacingBefore(15);
                document.add(ok);
            }

            document.add(Chunk.NEWLINE);
            document.add(new Paragraph("Observaciones del técnico:", sectionFont));
            document.add(new Paragraph(revision.getObservaciones()));



            document.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    // ✅ Valores esperados
    private Map<String, Boolean> getCriterios() {
        Map<String, Boolean> criterios = new HashMap<>();


        // Garantía
        criterios.put("equipoGarantia", true);

        // Estado general
        criterios.put("equipoEnciende", true);
        criterios.put("estaOperando", true);
        criterios.put("estaPartido", false);
        criterios.put("estaManchado", false);

        // Piezas faltantes
        criterios.put("tornillos", false);
        criterios.put("tapas", false);
        criterios.put("display", false);
        criterios.put("tarjetasElectronicas", false);
        criterios.put("botones", false);
        criterios.put("cabezal", false);

        // Parte mecánica
        criterios.put("oxido", false);
        criterios.put("ruidos", false);
        criterios.put("piñoneriaEnBuenEstado", true);
        criterios.put("correasEnBuenEstado", true);

        // Pantalla
        criterios.put("funciona", true);
        criterios.put("partida", false);
        criterios.put("lineasQuemadas", false);
        criterios.put("quemada", false);

        // Cabezal
        criterios.put("bueno", true);
        criterios.put("lineasBlancas", false);
        criterios.put("calibrado", true);
        criterios.put("limpio", true);

        // Rodillo
        criterios.put("buenos", true);
        criterios.put("picados", false);
        criterios.put("rayados", false);
        criterios.put("adhesivo", false);

        // Electrónico
        criterios.put("humedad", false);
        criterios.put("tarjetaElectronica", true);

        return criterios;
    }

    // ✅ Textos descriptivos
    private Map<String, String> getPreguntas() {
        Map<String, String> preguntas = new HashMap<>();

        // Nuevos campos

        preguntas.put("equipoGarantia", "¿El equipo está en garantía?");

        // Estado general
        preguntas.put("equipoEnciende", "¿El equipo enciende correctamente?");
        preguntas.put("estaOperando", "¿El equipo opera con normalidad?");
        preguntas.put("estaPartido", "¿El equipo presenta partes rotas?");
        preguntas.put("estaManchado", "¿El equipo tiene manchas o suciedad?");
        preguntas.put("tornillos", "¿Faltan tornillos?");
        preguntas.put("tapas", "¿Faltan tapas o cubiertas?");
        preguntas.put("display", "¿El display está ausente o dañado?");
        preguntas.put("tarjetasElectronicas", "¿Faltan tarjetas electrónicas?");
        preguntas.put("botones", "¿Faltan o están dañados los botones?");
        preguntas.put("cabezal", "¿Falta el cabezal?");
        preguntas.put("oxido", "¿Hay presencia de óxido?");
        preguntas.put("ruidos", "¿El equipo genera ruidos anormales?");
        preguntas.put("piñoneriaEnBuenEstado", "¿La piñonería está en buen estado?");
        preguntas.put("correasEnBuenEstado", "¿Las correas están en buen estado?");
        preguntas.put("funciona", "¿La pantalla funciona correctamente?");
        preguntas.put("partida", "¿La pantalla está partida?");
        preguntas.put("lineasQuemadas", "¿La pantalla tiene líneas quemadas?");
        preguntas.put("quemada", "¿La pantalla está quemada?");
        preguntas.put("bueno", "¿El cabezal está en buen estado?");
        preguntas.put("lineasBlancas", "¿Presenta líneas blancas al imprimir?");
        preguntas.put("calibrado", "¿Está correctamente calibrado?");
        preguntas.put("limpio", "¿El cabezal está limpio?");
        preguntas.put("buenos", "¿Los rodillos están en buen estado?");
        preguntas.put("picados", "¿Los rodillos están picados?");
        preguntas.put("rayados", "¿Los rodillos están rayados?");
        preguntas.put("adhesivo", "¿Tienen residuos de adhesivo?");
        preguntas.put("humedad", "¿Hay humedad en el sistema electrónico?");
        preguntas.put("tarjetaElectronica", "¿La tarjeta electrónica está en buen estado?");
        return preguntas;
    }

    // ✅ Observaciones automáticas
    private Map<String, String> getObservacionesAuto() {
        Map<String, String> obs = new HashMap<>();

        // Nuevos campos
        obs.put("equipoGarantia", "Equipo fuera de garantía.");

        // Resto de observaciones
        obs.put("equipoEnciende", "El equipo no enciende.");
        obs.put("estaOperando", "El equipo no opera correctamente.");
        obs.put("estaPartido", "El equipo presenta partes rotas.");
        obs.put("estaManchado", "El equipo tiene manchas o suciedad visible.");
        obs.put("tornillos", "Faltan tornillos en el equipo.");
        obs.put("tapas", "Faltan tapas o cubiertas.");
        obs.put("display", "El display está ausente o dañado.");
        obs.put("tarjetasElectronicas", "Faltan tarjetas electrónicas internas.");
        obs.put("botones", "Botones faltantes o dañados.");
        obs.put("cabezal", "Falta el cabezal de impresión.");
        obs.put("oxido", "Se observa presencia de óxido.");
        obs.put("ruidos", "El equipo genera ruidos anormales.");
        obs.put("piñoneriaEnBuenEstado", "La piñonería presenta desgaste o daños.");
        obs.put("correasEnBuenEstado", "Las correas están desgastadas o rotas.");
        obs.put("funciona", "La pantalla no funciona correctamente.");
        obs.put("partida", "La pantalla está partida.");
        obs.put("lineasQuemadas", "La pantalla presenta líneas quemadas.");
        obs.put("quemada", "La pantalla está quemada.");
        obs.put("bueno", "El cabezal presenta fallas o desgaste.");
        obs.put("lineasBlancas", "El cabezal imprime con líneas blancas.");
        obs.put("calibrado", "El cabezal no está calibrado.");
        obs.put("limpio", "El cabezal presenta suciedad.");
        obs.put("buenos", "Los rodillos presentan desgaste.");
        obs.put("picados", "Los rodillos están picados.");
        obs.put("rayados", "Los rodillos están rayados.");
        obs.put("adhesivo", "Los rodillos tienen residuos de adhesivo.");
        obs.put("humedad", "Presencia de humedad en la parte electrónica.");
        obs.put("tarjetaElectronica", "La tarjeta electrónica presenta fallas.");

        return obs;
    }

    // ✅ Convierte Revision → Map<String, Boolean>
    public static class RevisionMapperUtil {
        public static Map<String, Boolean> toMap(Revision revision) {
            Map<String, Boolean> map = new HashMap<>();
            try {
                for (Method method : Revision.class.getDeclaredMethods()) {
                    if (method.getName().startsWith("is")) {
                        String field = method.getName().substring(2, 3).toLowerCase() + method.getName().substring(3);
                        Object val = method.invoke(revision);
                        if (val instanceof Boolean) {
                            map.put(field, (Boolean) val);
                        }
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            return map;
        }
    }
}
