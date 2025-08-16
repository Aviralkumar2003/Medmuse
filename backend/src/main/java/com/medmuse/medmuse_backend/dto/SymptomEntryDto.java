package com.medmuse.medmuse_backend.dto;


import java.time.LocalDate;
import java.time.LocalDateTime;

import com.medmuse.medmuse_backend.entity.SymptomEntry;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SymptomEntryDto {
    private Long id;
    
    @NotNull(message = "Symptom ID is required")
    private Long symptomId;
    
    @NotNull(message = "Severity is required")
    @Min(value = 1, message = "Severity must be between 1 and 10")
    @Max(value = 10, message = "Severity must be between 1 and 10")
    private Integer severity;
    
    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;
    
    @NotNull(message = "Entry date is required")
    private LocalDate entryDate;
    
    private String symptomName;
    private String symptomCategory;
    private LocalDateTime createdAt;
    
    // Constructors
    public SymptomEntryDto() {}
    
    public SymptomEntryDto(SymptomEntry entry) {
        this.id = entry.getId();
        this.symptomId = entry.getSymptom().getId();
        this.severity = entry.getSeverity();
        this.notes = entry.getNotes();
        this.entryDate = entry.getEntryDate();
        this.symptomName = entry.getSymptom().getName();
        this.symptomCategory = entry.getSymptom().getCategory();
        this.createdAt = entry.getCreatedAt();
    }
}
