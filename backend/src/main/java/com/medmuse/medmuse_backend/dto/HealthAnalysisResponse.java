package com.medmuse.medmuse_backend.dto;

import lombok.Data;

@Data
public class HealthAnalysisResponse {
    private String healthSummary;
    private String riskAreas;
    private String recommendations;
    private String aiProvider;
    
    public HealthAnalysisResponse(String healthSummary, String riskAreas, String recommendations, String aiProvider) {
        this.healthSummary = healthSummary;
        this.riskAreas = riskAreas;
        this.recommendations = recommendations;
        this.aiProvider = aiProvider;
    }
}
