package com.medmuse.medmuse_backend.dto;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GenerateReportRequest {
    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    private List<Long> symptomIds;
}
