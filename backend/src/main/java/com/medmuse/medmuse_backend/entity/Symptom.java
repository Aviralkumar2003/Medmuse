package com.medmuse.medmuse_backend.entity;

import java.util.List;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "symptoms")
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
    private boolean active = true;
    
    @OneToMany(mappedBy = "symptom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SymptomEntry> entries;

    public Symptom(String name, String category, String description) {
        this.name = name;
        this.category = category;
        this.description = description;
        this.active = true;
    }
}
