package com.medmuse.medmuse_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medmuse.medmuse_backend.dto.SymptomEntryDto;
import com.medmuse.medmuse_backend.dto.UserDto;
import com.medmuse.medmuse_backend.service.interfaces.SymptomServiceInterface;
import com.medmuse.medmuse_backend.service.interfaces.UserServiceInterface;
import com.medmuse.medmuse_backend.util.UserContext;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/symptom-entries")
@CrossOrigin(origins = "${medmuse.cors.allowed-origins}")
class SymptomEntryController {
    
    private final SymptomServiceInterface symptomService;
    private final UserServiceInterface userService;
    
    public SymptomEntryController(SymptomServiceInterface symptomService, UserServiceInterface userService) {
        this.symptomService = symptomService;
        this.userService = userService;
    }
    
    @PostMapping
    public ResponseEntity<List<SymptomEntryDto>> createSymptomEntries(
            @AuthenticationPrincipal OidcUser principal,
            @Valid @RequestBody Map<String, List<SymptomEntryDto>> request) {
        
        UserDto user = UserContext.getCurrentUser(principal, userService);
        List<SymptomEntryDto> entries = request.get("entries");
        
        List<SymptomEntryDto> createdEntries = symptomService.createMultipleSymptomEntries(user.getId(), entries);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEntries);
    }
    
    @GetMapping("/my")
    public ResponseEntity<Page<SymptomEntryDto>> getUserSymptomEntries(
            @AuthenticationPrincipal OidcUser principal,
            Pageable pageable) {
        
        UserDto user = UserContext.getCurrentUser(principal, userService);
        Page<SymptomEntryDto> entries = symptomService.getUserSymptomEntries(user.getId(), pageable);
        return ResponseEntity.ok(entries);
    }
    
    @PutMapping("/{entryId}")
    public ResponseEntity<SymptomEntryDto> updateSymptomEntry(
            @AuthenticationPrincipal OidcUser principal,
            @PathVariable Long entryId,
            @Valid @RequestBody SymptomEntryDto updateDto) {
        
        UserDto user = UserContext.getCurrentUser(principal, userService);
        SymptomEntryDto updatedEntry = symptomService.updateSymptomEntry(user.getId(), entryId, updateDto);
        return ResponseEntity.ok(updatedEntry);
    }
    
    @DeleteMapping("/{entryId}")
    public ResponseEntity<Void> deleteSymptomEntry(
            @AuthenticationPrincipal OidcUser principal,
            @PathVariable Long entryId) {
        
        UserDto user = UserContext.getCurrentUser(principal, userService);
        symptomService.deleteSymptomEntry(user.getId(), entryId);
        return ResponseEntity.noContent().build();
    }
}