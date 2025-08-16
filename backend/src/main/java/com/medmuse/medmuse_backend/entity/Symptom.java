package com.medmuse.medmuse_backend.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "symptoms")
@Data
@NoArgsConstructor
public class Symptom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    @Column(nullable = false)
    private String category;
    
    private String description;
    
    @Column(nullable = false)
    private boolean isActive = true;
    
    @OneToMany(mappedBy = "symptom", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SymptomEntry> symptomEntries;
    
    public Symptom(String name, String category, String description) {
        this.name = name;
        this.category = category;
        this.description = description;
        this.isActive = true;
    }
}
