package com.medmuse.medmuse_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SymptomDto {
    private Long id;
    private String name;
    private String category;
    private String description;
}

