package com.medmuse.medmuse_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class HealthAnalysisResponse {
    private String healthSummary;
    private String riskAreas;
    private String recommendations;
    private String aiProvider;
}