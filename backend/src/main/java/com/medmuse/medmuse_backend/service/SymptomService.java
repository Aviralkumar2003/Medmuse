package com.medmuse.medmuse_backend.service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medmuse.medmuse_backend.dto.SymptomEntryDto;
import com.medmuse.medmuse_backend.dto.SymptomsFilterRequestDto;
import com.medmuse.medmuse_backend.entity.*;
import com.medmuse.medmuse_backend.repository.*;
import com.medmuse.medmuse_backend.service.interfaces.SymptomServiceInterface;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class SymptomService implements SymptomServiceInterface {
    
    private final SymptomRepository symptomRepository;
    private final SymptomEntryRepository symptomEntryRepository;
    private final UserRepository userRepository;
    
   

    @Override
    public List<Symptom> getAllActiveSymptoms() {
        return symptomRepository.findByIsActiveTrue();
    }
    
    @Override
    public List<Symptom> getSymptomsByCategory(String category) {
        return symptomRepository.findByCategoryAndIsActiveTrue(category);
    }
    
    @Override
    public List<Symptom> searchSymptoms(String searchTerm) {
        return symptomRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(searchTerm);
    }
    
    @Override
    public SymptomEntryDto createSymptomEntry(Long userId, SymptomEntryDto entryDto) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        
        Symptom symptom = symptomRepository.findById(entryDto.getSymptomId())
            .orElseThrow(() -> new RuntimeException("Symptom not found"));
        
        SymptomEntry entry = new SymptomEntry(user, symptom, entryDto.getSeverity(), 
                                            entryDto.getNotes(), entryDto.getEntryDate());
        entry = symptomEntryRepository.save(entry);
        
        return new SymptomEntryDto(entry);
    }
    
    @Override
    public List<SymptomEntryDto> createMultipleSymptomEntries(Long userId, List<SymptomEntryDto> entryDtos) {
        return entryDtos.stream()
            .map(dto -> createSymptomEntry(userId, dto))
            .collect(Collectors.toList());
    }
    
    @Override
    public Page<SymptomEntryDto> getUserSymptomEntries(Long userId, Pageable pageable) {
        return symptomEntryRepository.findByUserIdOrderByEntryDateDesc(userId, pageable)
            .map(SymptomEntryDto::new);
    }
    
    @Override
    public List<SymptomEntryDto> getUserSymptomEntriesByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        return symptomEntryRepository.findByUserIdAndEntryDateBetweenOrderByEntryDateDesc(userId, startDate, endDate)
            .stream()
            .map(SymptomEntryDto::new)
            .collect(Collectors.toList());
    }
    
    @Override
    public SymptomEntryDto updateSymptomEntry(Long userId, Long entryId, SymptomEntryDto updateDto) {
        SymptomEntry entry = symptomEntryRepository.findById(entryId)
            .orElseThrow(() -> new RuntimeException("Symptom entry not found: " + entryId));
        
        if (!entry.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to symptom entry: " + entryId);
        }
        
        if (updateDto.getSeverity() != null) {
            entry.setSeverity(updateDto.getSeverity());
        }
        if (updateDto.getNotes() != null) {
            entry.setNotes(updateDto.getNotes());
        }
        
        entry = symptomEntryRepository.save(entry);
        return new SymptomEntryDto(entry);
    }
    
    @Override
    public void deleteSymptomEntry(Long userId, Long entryId) {
        SymptomEntry entry = symptomEntryRepository.findById(entryId)
            .orElseThrow(() -> new RuntimeException("Symptom entry not found: " + entryId));
        
        if (!entry.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to symptom entry: " + entryId);
        }
        
        symptomEntryRepository.delete(entry);
    }

   @Override
    public List<Symptom> getSymptomsByUserAndDate(Long userId, LocalDate localDate) {
        log.info("Fetching symptoms for userId: {} on date: {}", userId, localDate);
        return symptomRepository.findByUserIdAndDate(userId, localDate);
    }

    @Override
    public List<Symptom> getSymptomsByUser(Long userId) {
        log.info("Fetching all symptoms for userId: {}", userId);
        return symptomRepository.findByUserId(userId);
    }
@Override
public List<SymptomEntry> filterSympotoms(SymptomsFilterRequestDto symptomsFilterRequest) {
    log.info("Fetching the symptoms as per the filter");

    List<SymptomEntry> allEntries = symptomEntryRepository.findAll();

    return allEntries.stream()
            .filter(s -> symptomsFilterRequest.getDate() == null 
                    || (s.getEntryDate() != null && s.getEntryDate().equals(symptomsFilterRequest.getDate())))
            .filter(s -> symptomsFilterRequest.getSymptom() == null 
                    || (s.getSymptom() != null 
                        && s.getSymptom().getName().equalsIgnoreCase(symptomsFilterRequest.getSymptom())))
            .filter(s -> symptomsFilterRequest.getSeverity() == null 
                    || (s.getSeverity() != null 
                        && s.getSeverity().equals(symptomsFilterRequest.getSeverity())))
            .collect(Collectors.toList());
}


}
