package com.medmuse.medmuse_backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SymptomEntryDto {
    private Long id;
    private Long symptomId;
    private String symptomName;
    private String symptomCategory;
    private String customDescription;
    private Integer severity;
    private String notes;
    private LocalDate entryDate;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime entryTime;

    private LocalDateTime loggedAt;
    private LocalDateTime createdAt;
}
