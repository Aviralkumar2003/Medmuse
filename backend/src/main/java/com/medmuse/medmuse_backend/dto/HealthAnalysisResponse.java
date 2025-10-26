package com.medmuse.medmuse_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HealthAnalysisResponse {
    private String healthSummary;
    private String riskAreas;
    private String recommendations;
    private String aiProvider;
}