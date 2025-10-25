package com.medmuse.medmuse_backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class ReportDto {
    private Long id;
    private LocalDate weekStartDate;
    private LocalDate weekEndDate;
    private LocalDateTime generatedAt;
    private String healthSummary;
    private String riskAreas;
    private String recommendations;
    private String pdfPath;
}
