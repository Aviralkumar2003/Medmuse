package com.medmuse.medmuse_backend.dto;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.medmuse.medmuse_backend.entity.Report;

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
    private boolean hasPdf;
    
    public ReportDto(Report report) {
        this.id = report.getId();
        this.weekStartDate = report.getWeekStartDate();
        this.weekEndDate = report.getWeekEndDate();
        this.generatedAt = report.getGeneratedAt();
        this.healthSummary = report.getHealthSummary();
        this.riskAreas = report.getRiskAreas();
        this.recommendations = report.getRecommendations();
        this.hasPdf = report.getPdfPath() != null && !report.getPdfPath().isEmpty();
    }
}
