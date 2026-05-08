package com.medmuse.medmuse_backend.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "symptom_entries")
public class SymptomEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "symptom_id")
    private Symptom symptom;

    @Column(length = 500)
    private String customDescription;
    
    @Column(nullable = false)
    private Integer severity;
    
    @Column(length = 1000)
    private String notes;
    
    @Column(nullable = false)
    private LocalDate entryDate;

    @Column(nullable = false)
    private LocalTime entryTime;
    
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (entryDate == null) {
            entryDate = LocalDate.now();
        }
        if (entryTime == null) {
            entryTime = LocalTime.now().withSecond(0).withNano(0);
        }
        createdAt = LocalDateTime.now();
    }

    public SymptomEntry(User user, Symptom symptom, String customDescription, Integer severity, String notes, LocalDate entryDate, LocalTime entryTime) {
        this.user = user;
        this.symptom = symptom;
        this.customDescription = customDescription;
        this.severity = severity;
        this.notes = notes;
        this.entryDate = entryDate;
        this.entryTime = entryTime;
    }
}
