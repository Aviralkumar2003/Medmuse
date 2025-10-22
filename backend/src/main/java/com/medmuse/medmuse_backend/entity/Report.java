package com.medmuse.medmuse_backend.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonBackReference;

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

@Entity
@Table(name = "reports")
@Data
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public Report() {
        // Default constructor required by JPA
    }
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;
    
    @Column(nullable = false)
    private LocalDate weekStartDate;
    
    @Column(nullable = false)
    private LocalDate weekEndDate;
    
    @CreationTimestamp
    private LocalDateTime generatedAt;
    
    @Column(name = "health_summary", columnDefinition = "CLOB")
    private String healthSummary;

    @Column(name = "risk_areas", columnDefinition = "CLOB")
    private String riskAreas;

    @Column(name = "recommendations", columnDefinition = "CLOB")
    private String recommendations;


    private String pdfPath;

    
    public Report(User user, LocalDate weekStartDate, LocalDate weekEndDate) {
        this.user = user;
        this.weekStartDate = weekStartDate;
        this.weekEndDate = weekEndDate;
    }
}
