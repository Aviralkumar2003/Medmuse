package com.medmuse.medmuse_backend.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthAnalysisRequest {
    private Long userId;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<SymptomEntryDto> symptomEntries;
    private UserDemographicsDto demographics;
}
