package com.medmuse.medmuse_backend.service;
import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medmuse.medmuse_backend.dto.HealthAnalysisRequest;
import com.medmuse.medmuse_backend.dto.HealthAnalysisResponse;
import com.medmuse.medmuse_backend.dto.ReportDto;
import com.medmuse.medmuse_backend.dto.SymptomEntryDto;
import com.medmuse.medmuse_backend.entity.Report;
import com.medmuse.medmuse_backend.entity.User;
import com.medmuse.medmuse_backend.entity.UserDemographics;
import com.medmuse.medmuse_backend.repository.ReportRepository;
import com.medmuse.medmuse_backend.repository.UserRepository;
import com.medmuse.medmuse_backend.service.factory.StrategyFactory;
import com.medmuse.medmuse_backend.service.interfaces.ReportServiceInterface;
import com.medmuse.medmuse_backend.service.interfaces.SymptomServiceInterface;
import com.medmuse.medmuse_backend.service.strategy.DocumentGenerationStrategy;
import com.medmuse.medmuse_backend.service.strategy.ReportGenerationStrategy;
import com.medmuse.medmuse_backend.util.ExceptionHandler;

@Service
@Transactional
public class ReportService implements ReportServiceInterface {
    
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final SymptomServiceInterface symptomService;
    private final StrategyFactory strategyFactory;
    
    public ReportService(ReportRepository reportRepository,
                        UserRepository userRepository,
                        SymptomServiceInterface symptomService,
                        StrategyFactory strategyFactory) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.symptomService = symptomService;
        this.strategyFactory = strategyFactory;
    }
    
    @Async
    @Override
    public CompletableFuture<ReportDto> generateWeeklyReport(Long userId) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(6);
        
        return generateReportForPeriod(userId, startDate, endDate);
    }
    
    @Async
    @Override
    public CompletableFuture<ReportDto> generateReportForPeriod(Long userId, LocalDate startDate, LocalDate endDate) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        UserDemographics demographics = user.getDemographics();
        
        List<SymptomEntryDto> symptomEntries = symptomService.getUserSymptomEntriesByDateRange(userId, startDate, endDate);
        
        if (symptomEntries.isEmpty()) {
            throw new RuntimeException("Insufficient data for operation: at least 3 days of symptom entries");
        }
        
        HealthAnalysisRequest analysisRequest = new HealthAnalysisRequest(userId, demographics, startDate, endDate, symptomEntries);
        
        ReportGenerationStrategy reportStrategy = strategyFactory.getReportGenerationStrategy("AI_ANALYSIS");
        
        return reportStrategy.analyzeHealthData(analysisRequest)
            .thenApply(analysisResponse -> {
                Report report = createReportFromAnalysis(user, startDate, endDate, analysisResponse);
                Report savedReport = reportRepository.save(report);
                
                // Generate document asynchronously
                generateDocumentAsync(savedReport);
                
                return new ReportDto(savedReport);
            });
    }
    
    private Report createReportFromAnalysis(User user, LocalDate startDate, LocalDate endDate, 
                                          HealthAnalysisResponse analysisResponse) {
        Report report = new Report(user, startDate, endDate);
        report.setHealthSummary(analysisResponse.getHealthSummary());
        report.setRiskAreas(analysisResponse.getRiskAreas());
        report.setRecommendations(analysisResponse.getRecommendations());
        return report;
    }
    
    @Async
    protected void generateDocumentAsync(Report report) {
        try {
            DocumentGenerationStrategy documentStrategy = strategyFactory.getDocumentGenerationStrategy("PDF");
            String documentPath = documentStrategy.generateDocument(report);
            report.setPdfPath(documentPath);
            reportRepository.save(report);
        } catch (Exception e) {
            ExceptionHandler.handleDocumentGenerationException("PDF", report.getId(), e);
        }
    }
    
    @Override
    public List<ReportDto> getUserReports(Long userId) {
        return reportRepository.findByUserIdOrderByGeneratedAtDesc(userId)
            .stream()
            .map(ReportDto::new)
            .collect(Collectors.toList());
    }
    
    @Override
    public Page<ReportDto> getUserReports(Long userId, Pageable pageable) {
        return reportRepository.findByUserIdOrderByGeneratedAtDesc(userId, pageable)
            .map(ReportDto::new);
    }
    
    @Override
    public ReportDto getReportById(Long userId, Long reportId) {
        Report report = reportRepository.findByIdAndUserId(reportId, userId)
            .orElseThrow(() -> new RuntimeException("Report not found: " + reportId));
        
        return new ReportDto(report);
    }
    
    @Override
    public void deleteReport(Long userId, Long reportId) {
        Report report = reportRepository.findByIdAndUserId(reportId, userId)
            .orElseThrow(() -> new RuntimeException("Report not found: " + reportId));
        
        if (report.getPdfPath() != null) {
            DocumentGenerationStrategy documentStrategy = strategyFactory.getDocumentGenerationStrategy("PDF");
            documentStrategy.deleteDocument(report.getPdfPath());
        }
        
        reportRepository.delete(report);
    }
    
    @Override
    public byte[] getReportPdf(Long userId, Long reportId) {
        Report report = reportRepository.findByIdAndUserId(reportId, userId)
            .orElseThrow(() -> new RuntimeException("Report not found: " + reportId));
        
        if (report.getPdfPath() == null) {
            // Generate document if it doesn't exist
            DocumentGenerationStrategy documentStrategy = strategyFactory.getDocumentGenerationStrategy("PDF");
            String documentPath = documentStrategy.generateDocument(report);
            report.setPdfPath(documentPath);
            reportRepository.save(report);
        }
        
        DocumentGenerationStrategy documentStrategy = strategyFactory.getDocumentGenerationStrategy("PDF");
        return documentStrategy.readDocument(report.getPdfPath());
    }
}
