package com.medmuse.medmuse_backend.service.interfaces;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.medmuse.medmuse_backend.dto.SymptomEntryDto;
import com.medmuse.medmuse_backend.entity.Symptom;

public interface SymptomServiceInterface {
    List<Symptom> getAllActiveSymptoms();
    List<Symptom> getSymptomsByCategory(String category);
    List<Symptom> searchSymptoms(String searchTerm);
    SymptomEntryDto createSymptomEntry(Long userId, SymptomEntryDto entryDto);
    List<SymptomEntryDto> createMultipleSymptomEntries(Long userId, List<SymptomEntryDto> entryDtos);
    Page<SymptomEntryDto> getUserSymptomEntries(Long userId, Pageable pageable);
    List<SymptomEntryDto> getUserSymptomEntriesByDateRange(Long userId, LocalDate startDate, LocalDate endDate);
    SymptomEntryDto updateSymptomEntry(Long userId, Long entryId, SymptomEntryDto updateDto);
    void deleteSymptomEntry(Long userId, Long entryId);
}
