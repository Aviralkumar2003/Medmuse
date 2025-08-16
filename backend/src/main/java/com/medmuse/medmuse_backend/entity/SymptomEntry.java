package com.medmuse.medmuse_backend.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "symptom_entries")
@Data
@NoArgsConstructor
public class SymptomEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "symptom_id", nullable = false)
    private Symptom symptom;
    
    @Column(nullable = false)
    private Integer severity;
    
    @Column(length = 1000)
    private String notes;
    
    @Column(nullable = false)
    private LocalDate entryDate;
    
    @CreationTimestamp
    private LocalDateTime createdAt;

    
    public SymptomEntry(User user, Symptom symptom, Integer severity, String notes, LocalDate entryDate) {
        this.user = user;
        this.symptom = symptom;
        this.severity = severity;
        this.notes = notes;
        this.entryDate = entryDate;
    }
}
