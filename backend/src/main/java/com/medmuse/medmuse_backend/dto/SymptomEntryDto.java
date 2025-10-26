package com.medmuse.medmuse_backend.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SymptomEntryDto {
    private Long symptomId;
    private String symptomName;
    private String category;
    private Integer severity;
    private String notes;
    private LocalDate entryDate;
}
