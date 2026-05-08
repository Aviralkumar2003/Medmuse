package com.medmuse.medmuse_backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.medmuse.medmuse_backend.dto.SymptomDto;
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
    public List<SymptomDto> getAllActiveSymptoms() {
        return symptomRepository.findByIsActiveTrue().stream()
            .map(symptom -> modelMapper.map(symptom, SymptomDto.class))
            .collect(Collectors.toList());
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

        Symptom symptom = resolveSymptom(entryDto.getSymptomId());
        String customDescription = normalizeCustomDescription(entryDto.getCustomDescription());

        if (symptom == null && !StringUtils.hasText(customDescription)) {
            throw new RuntimeException("Either symptomId or customDescription is required");
        }
        
        SymptomEntry entry = new SymptomEntry(
            user,
            symptom,
            customDescription,
            resolveSeverity(entryDto.getSeverity()),
            entryDto.getNotes(),
            resolveEntryDate(entryDto.getEntryDate()),
            resolveEntryTime(entryDto.getEntryTime())
        );
        entry = symptomEntryRepository.save(entry);
        
        return toDto(entry);
    }
    
    @Override
    public List<SymptomEntryDto> createMultipleSymptomEntries(Long userId, List<SymptomEntryDto> entryDtos) {
        return entryDtos.stream()
            .map(dto -> createSymptomEntry(userId, dto))
            .collect(Collectors.toList());
    }
    
    @Override
    public Page<SymptomEntryDto> getUserSymptomEntries(Long userId, Pageable pageable) {
        return symptomEntryRepository.findByUserIdOrderByEntryDateDescEntryTimeDesc(userId, pageable)
            .map(this::toDto);
    }
    
    @Override
    public List<SymptomEntryDto> getUserSymptomEntriesByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        return symptomEntryRepository.findByUserIdAndEntryDateBetweenOrderByEntryDateDescEntryTimeDesc(userId, startDate, endDate)
            .stream()
            .map(this::toDto)
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
        if (updateDto.getEntryDate() != null) {
            entry.setEntryDate(updateDto.getEntryDate());
        }
        if (updateDto.getEntryTime() != null) {
            entry.setEntryTime(resolveEntryTime(updateDto.getEntryTime()));
        }
        if (updateDto.getSymptomId() != null) {
            Symptom updatedSymptom = resolveSymptom(updateDto.getSymptomId());
            if (entry.getSymptom() == null || !updateDto.getSymptomId().equals(entry.getSymptom().getId())) {
                entry.setSymptom(updatedSymptom);
                entry.setCustomDescription(null);
            }
        } else if (StringUtils.hasText(updateDto.getCustomDescription())) {
            entry.setSymptom(null);
            entry.setCustomDescription(normalizeCustomDescription(updateDto.getCustomDescription()));
        }
        
        entry = symptomEntryRepository.save(entry);
        return toDto(entry);
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

    private SymptomEntryDto toDto(SymptomEntry entry) {
        LocalDateTime loggedAt = null;
        if (entry.getEntryDate() != null && entry.getEntryTime() != null) {
            loggedAt = LocalDateTime.of(entry.getEntryDate(), entry.getEntryTime());
        }

        return new SymptomEntryDto(
            entry.getId(),
            entry.getSymptom() != null ? entry.getSymptom().getId() : null,
            entry.getSymptom() != null ? entry.getSymptom().getName() : "Custom symptom",
            entry.getSymptom() != null ? entry.getSymptom().getCategory() : "Custom",
            entry.getCustomDescription(),
            entry.getSeverity(),
            entry.getNotes(),
            entry.getEntryDate(),
            entry.getEntryTime(),
            loggedAt,
            entry.getCreatedAt()
        );
    }

    private LocalDate resolveEntryDate(LocalDate entryDate) {
        return entryDate != null ? entryDate : LocalDate.now();
    }

    private LocalTime resolveEntryTime(LocalTime entryTime) {
        LocalTime resolvedTime = entryTime != null ? entryTime : LocalTime.now();
        return resolvedTime.withSecond(0).withNano(0);
    }

    private Integer resolveSeverity(Integer severity) {
        return severity != null ? severity : 5;
    }

    private Symptom resolveSymptom(Long symptomId) {
        if (symptomId == null) {
            return null;
        }

        return symptomRepository.findById(symptomId)
            .orElseThrow(() -> new RuntimeException("Symptom not found"));
    }

    private String normalizeCustomDescription(String customDescription) {
        if (!StringUtils.hasText(customDescription)) {
            return null;
        }

        return customDescription.trim();
    }
}
