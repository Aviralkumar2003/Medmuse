package com.medmuse.medmuse_backend.dto;

import java.time.LocalDate;
import lombok.Data;

@Data
public class SymptomEntryDto {
    private Long symptomId;
    private String symptomName;
    private String category;
    private Integer severity;
    private String notes;
    private LocalDate entryDate;
}
