package com.medmuse.medmuse_backend.service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medmuse.medmuse_backend.dto.SymptomEntryDto;
import com.medmuse.medmuse_backend.entity.Symptom;
import com.medmuse.medmuse_backend.entity.SymptomEntry;
import com.medmuse.medmuse_backend.entity.User;
import com.medmuse.medmuse_backend.repository.SymptomEntryRepository;
import com.medmuse.medmuse_backend.repository.SymptomRepository;
import com.medmuse.medmuse_backend.repository.UserRepository;
import com.medmuse.medmuse_backend.service.interfaces.SymptomServiceInterface;

@Service
@Transactional
public class SymptomService implements SymptomServiceInterface {

    @Autowired
    private ModelMapper modelMapper;
    
    private final SymptomRepository symptomRepository;
    private final SymptomEntryRepository symptomEntryRepository;
    private final UserRepository userRepository;
    
    public SymptomService(SymptomRepository symptomRepository,
                         SymptomEntryRepository symptomEntryRepository,
                         UserRepository userRepository) {
        this.symptomRepository = symptomRepository;
        this.symptomEntryRepository = symptomEntryRepository;
        this.userRepository = userRepository;
    }

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
        
        return modelMapper.map(entry, SymptomEntryDto.class);
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
            .map(entry -> modelMapper.map(entry, SymptomEntryDto.class));
    }
    
    @Override
    public List<SymptomEntryDto> getUserSymptomEntriesByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        return symptomEntryRepository.findByUserIdAndEntryDateBetweenOrderByEntryDateDesc(userId, startDate, endDate)
            .stream()
            .map(entry -> modelMapper.map(entry, SymptomEntryDto.class))
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
        return modelMapper.map(entry, SymptomEntryDto.class);
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
}
