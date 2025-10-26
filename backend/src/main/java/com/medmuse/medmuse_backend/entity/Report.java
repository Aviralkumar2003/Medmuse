package com.medmuse.medmuse_backend.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reports")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private LocalDate weekStartDate;
    
    @Column(nullable = false)
    private LocalDate weekEndDate;

    private LocalDateTime generatedAt;

    @Column(columnDefinition = "CLOB")
    private String healthSummary;

    @Column(columnDefinition = "CLOB")
    private String riskAreas;

    @Column(columnDefinition = "CLOB")
    private String recommendations;

    private String pdfPath;

    @PrePersist
    protected void onCreate() {
        generatedAt = LocalDateTime.now();
    }

    public Report(User user, LocalDate weekStartDate, LocalDate weekEndDate) {
        this.user = user;
        this.weekStartDate = weekStartDate;
        this.weekEndDate = weekEndDate;
    }
}
