package com.medmuse.medmuse_backend.controller;
import java.util.List;
import java.time.LocalDate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.medmuse.medmuse_backend.dto.SymptomsFilterRequestDto;
import com.medmuse.medmuse_backend.entity.Symptom;
import com.medmuse.medmuse_backend.entity.SymptomEntry;
import com.medmuse.medmuse_backend.service.SymptomService;
import com.medmuse.medmuse_backend.service.interfaces.SymptomServiceInterface;
import lombok.*;
import lombok.extern.slf4j.Slf4j;


@RestController
@RequiredArgsConstructor
@RequestMapping("/symptoms")
@CrossOrigin(origins = "${medmuse.cors.allowed-origins}")
@Slf4j
public class SymptomController {
    
    private final SymptomServiceInterface symptomService;
   
    
    @GetMapping("/getAllSymptoms")
    public ResponseEntity<List<Symptom>> getAllSymptoms() {
        System.out.println("Fetching all symptoms");
        List<Symptom> symptoms = symptomService.getAllActiveSymptoms();
        return ResponseEntity.ok(symptoms);
    }

    @GetMapping("/getLoggedSymptoms")
    public ResponseEntity<List<Symptom>> getLoggedSymptoms(
            @RequestParam Long userId,
            @RequestParam(required = false) String date) {
        
        log.info("Fetching logged symptoms for userId={} and date={}", userId, date);

        List<Symptom> symptoms;
        if (date != null) {
            LocalDate localDate = LocalDate.parse(date);
            symptoms = symptomService.getSymptomsByUserAndDate(userId, localDate);
        } else {
            symptoms = symptomService.getSymptomsByUser(userId);
        }

        return ResponseEntity.ok(symptoms);
    }


    @GetMapping("/symptoms/filter")
    public List<SymptomEntry> filterSymptoms(@RequestBody SymptomsFilterRequestDto filterRequest) {
    return symptomService.filterSympotoms(filterRequest);
}

    
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Symptom>> getSymptomsByCategory(@PathVariable String category) {
        List<Symptom> symptoms = symptomService.getSymptomsByCategory(category);
        return ResponseEntity.ok(symptoms);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Symptom>> searchSymptoms(@RequestParam String q) {
        List<Symptom> symptoms = symptomService.searchSymptoms(q);
        return ResponseEntity.ok(symptoms);
    }
}
