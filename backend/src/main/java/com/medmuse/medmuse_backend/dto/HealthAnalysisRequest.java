package com.medmuse.medmuse_backend.dto;
import java.time.LocalDate;
import java.util.List;

import com.medmuse.medmuse_backend.entity.UserDemographics;

import lombok.Data;

@Data
public class HealthAnalysisRequest {
    private Long userId;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<SymptomEntryDto> symptomEntries;
    private UserDemographics userDemographics;
    
    public HealthAnalysisRequest(Long userId, UserDemographics userDemographics, LocalDate startDate, LocalDate endDate, List<SymptomEntryDto> symptomEntries) {
        this.userId = userId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.symptomEntries = symptomEntries;
        this.userDemographics = userDemographics;
    }
}
