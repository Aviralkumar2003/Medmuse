package com.medmuse.medmuse_backend.service.strategy;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import com.medmuse.medmuse_backend.entity.Report;
import com.medmuse.medmuse_backend.util.ExceptionHandler;

@Component
public class PdfDocumentGenerationStrategy implements DocumentGenerationStrategy {

    @Value("${medmuse.storage.pdf.directory}")
    private String pdfDirectory;

    @Override
    public String generateDocument(Report report) {
        Path filePath = null;
        try {
            // Ensure directory exists
            Path directory = Paths.get(pdfDirectory);
            if (!Files.exists(directory)) {
                Files.createDirectories(directory);
            }

            // Generate filename
            String filename = String.format("health-report-%d-%s.pdf",
                    report.getId(), report.getWeekStartDate().toString());
            filePath = directory.resolve(filename);

            // Create PDF
            Document document = new Document();
            PdfWriter.getInstance(document, new FileOutputStream(filePath.toFile()));
            document.open();

            // Add content
            addHeader(document, report);
            addHealthSummary(document, report);
            addRiskAreas(document, report);
            addRecommendations(document, report);
            addDisclaimer(document);
            addFooter(document);

            document.close();

            return filePath.toString();
        } catch (DocumentException | IOException e) {
            String filePathStr = filePath != null ? filePath.toString() : "unknown";
            ExceptionHandler.handleFileOperationException("PDF generation", filePathStr, e);
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    @Override
    public byte[] readDocument(String filePath) {
        try {
            return Files.readAllBytes(Paths.get(filePath));
        } catch (IOException e) {
            ExceptionHandler.handleFileOperationException("PDF read", filePath, e);
            throw new RuntimeException("Failed to read PDF file", e);
        }
    }

    @Override
    public void deleteDocument(String filePath) {
        try {
            Files.deleteIfExists(Paths.get(filePath));
        } catch (IOException e) {
            ExceptionHandler.handleFileOperationException("PDF delete", filePath, e);
        }
    }

    @Override
    public String getDocumentFormat() {
        return "PDF";
    }

    @Override
    public boolean isAvailable() {
        return true; // PDF generation is always available
    }

    private void addHeader(Document document, Report report) throws DocumentException {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy");

        Paragraph title = new Paragraph("MedMuse Health Report",
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24));
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);

        Paragraph period = new Paragraph(
                String.format("Report Period: %s - %s",
                        report.getWeekStartDate().format(formatter),
                        report.getWeekEndDate().format(formatter)),
                FontFactory.getFont(FontFactory.HELVETICA, 12));
        period.setAlignment(Element.ALIGN_CENTER);
        document.add(period);

        Paragraph generated = new Paragraph(
                String.format("Generated on: %s",
                        report.getGeneratedAt().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' HH:mm"))),
                FontFactory.getFont(FontFactory.HELVETICA, 10));
        generated.setAlignment(Element.ALIGN_CENTER);
        generated.setSpacingAfter(20f);
        document.add(generated);
    }

    private void addHealthSummary(Document document, Report report) throws DocumentException {
        Paragraph header = new Paragraph("Health Summary",
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16));
        document.add(header);

        String[] paragraphs = report.getHealthSummary().split("\n\n");
        for (String paragraph : paragraphs) {
            if (!paragraph.trim().isEmpty()) {
                Paragraph p = new Paragraph(paragraph.trim(),
                        FontFactory.getFont(FontFactory.HELVETICA, 12));
                p.setSpacingAfter(5f);
                document.add(p);
            }
        }
        document.add(new Paragraph("\n"));
    }

    private void addRiskAreas(Document document, Report report) throws DocumentException {
        if (report.getRiskAreas() != null && !report.getRiskAreas().trim().isEmpty()) {
            Paragraph header = new Paragraph("Areas of Attention",
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16));
            document.add(header);

            String[] items = report.getRiskAreas().split("\n");
            for (String item : items) {
                if (!item.trim().isEmpty()) {
                    Paragraph bullet = new Paragraph("• " + item.trim(),
                            FontFactory.getFont(FontFactory.HELVETICA, 12));
                    bullet.setIndentationLeft(20f);
                    bullet.setSpacingAfter(3f);
                    document.add(bullet);
                }
            }
            document.add(new Paragraph("\n"));
        }
    }

    private void addRecommendations(Document document, Report report) throws DocumentException {
        Paragraph header = new Paragraph("Personalized Recommendations",
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16));
        document.add(header);

        String[] items = report.getRecommendations().split("\n");
        for (String item : items) {
            if (!item.trim().isEmpty()) {
                Paragraph bullet = new Paragraph("• " + item.trim(),
                        FontFactory.getFont(FontFactory.HELVETICA, 12));
                bullet.setIndentationLeft(20f);
                bullet.setSpacingAfter(3f);
                document.add(bullet);
            }
        }
        document.add(new Paragraph("\n"));
    }

    private void addDisclaimer(Document document) throws DocumentException {
        Paragraph header = new Paragraph("Medical Disclaimer",
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14));
        document.add(header);

        Paragraph disclaimer = new Paragraph(
                "This report is generated by AI for informational and educational purposes only. " +
                        "It should not be used as a substitute for professional medical advice, diagnosis, or treatment. " +
                        "Always consult with a qualified healthcare provider before making any healthcare decisions or " +
                        "for guidance about a specific medical condition.",
                new Font(Font.FontFamily.HELVETICA, 10, Font.ITALIC, BaseColor.DARK_GRAY)
        );
        disclaimer.setSpacingBefore(5f);
        disclaimer.setSpacingAfter(20f);
        document.add(disclaimer);
    }

    private void addFooter(Document document) throws DocumentException {
        Paragraph footer = new Paragraph("Generated by MedMuse Healthcare Platform",
                FontFactory.getFont(FontFactory.HELVETICA, 10));
        footer.setAlignment(Element.ALIGN_CENTER);
        footer.setSpacingBefore(30f);
        document.add(footer);
    }
}
