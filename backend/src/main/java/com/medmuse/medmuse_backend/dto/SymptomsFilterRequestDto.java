package com.medmuse.medmuse_backend.dto;

import java.time.LocalDate;

import lombok.*;
@Data

public class SymptomsFilterRequestDto {
    private String symptom;
    private LocalDate date ;
    private Integer severity;
    
}
