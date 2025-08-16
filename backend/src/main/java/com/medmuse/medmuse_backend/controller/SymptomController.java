package com.medmuse.medmuse_backend.controller;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.medmuse.medmuse_backend.entity.Symptom;
import com.medmuse.medmuse_backend.service.interfaces.SymptomServiceInterface;

@RestController
@RequestMapping("/symptoms")
@CrossOrigin(origins = "${medmuse.cors.allowed-origins}")
public class SymptomController {
    
    private final SymptomServiceInterface symptomService;
    
    public SymptomController(SymptomServiceInterface symptomService) {
        this.symptomService = symptomService;
    }
    
    @GetMapping("/getAllSymptoms")
    public ResponseEntity<List<Symptom>> getAllSymptoms() {
        System.out.println("Fetching all symptoms");
        List<Symptom> symptoms = symptomService.getAllActiveSymptoms();
        return ResponseEntity.ok(symptoms);
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
