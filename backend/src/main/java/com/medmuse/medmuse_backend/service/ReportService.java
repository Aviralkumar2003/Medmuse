package com.medmuse.medmuse_backend.service;

import com.medmuse.medmuse_backend.dto.*;
import com.medmuse.medmuse_backend.entity.Report;
import com.medmuse.medmuse_backend.entity.User;
import com.medmuse.medmuse_backend.entity.UserDemographics;
import com.medmuse.medmuse_backend.repository.ReportRepository;
import com.medmuse.medmuse_backend.repository.SymptomEntryRepository;
import com.medmuse.medmuse_backend.repository.UserRepository;
import com.medmuse.medmuse_backend.service.ai.AIServiceInterface;
import com.medmuse.medmuse_backend.service.interfaces.PdfServiceInterface;
import com.medmuse.medmuse_backend.service.interfaces.ReportServiceInterface;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class ReportService implements ReportServiceInterface {

    private final AIServiceInterface aiService;
    private final PdfServiceInterface pdfService;
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final SymptomEntryRepository symptomEntryRepository;

    private final ExecutorService executor = Executors.newCachedThreadPool();

    public ReportService(AIServiceInterface aiService,
            PdfServiceInterface pdfService,
            ReportRepository reportRepository,
            UserRepository userRepository,
            SymptomEntryRepository symptomEntryRepository) {
        this.aiService = aiService;
        this.pdfService = pdfService;
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.symptomEntryRepository = symptomEntryRepository;
    }

    @Override
    public CompletableFuture<ReportDto> generateWeeklyReport(Long userId) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusWeeks(1);

        return generateReportForPeriod(userId, startDate, endDate);
    }

    @Override
    public CompletableFuture<ReportDto> generateReportForPeriod(Long userId, LocalDate startDate, LocalDate endDate) {
        // Fetch user and demographics
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

        UserDemographics demo = user.getDemographics();
        if (demo == null) throw new RuntimeException("No demographics found for user: " + userId);

        List<SymptomEntryDto> symptomDtos = symptomEntryRepository
                .findByUserIdAndEntryDateBetweenOrderByEntryDateDesc(userId, startDate, endDate)
                .stream().map(SymptomEntryDto::new).toList();

        HealthAnalysisRequest request = new HealthAnalysisRequest(userId, demo, startDate, endDate, symptomDtos);

        // Call AI service asynchronously
        return aiService.analyzeHealthData(request)
                .thenApplyAsync(analysis -> {
                    // Log AI response
                    System.out.println("AI Response for user {}: Summary: {}, Risks: {}, Recommendations: {}"+
                            userId+
                            analysis.getHealthSummary()+
                            analysis.getRiskAreas()+
                            analysis.getRecommendations()
                    );

                    // Save report without PDF
                    Report report = new Report();
                    report.setUser(user);
                    report.setWeekStartDate(startDate);
                    report.setWeekEndDate(endDate);
                    report.setGeneratedAt(LocalDateTime.now());
                    report.setHealthSummary(analysis.getHealthSummary());
                    report.setRiskAreas(analysis.getRiskAreas());
                    report.setRecommendations(analysis.getRecommendations());

                    Report saved = reportRepository.save(report);
                    return new ReportDto(saved);
                }, executor);
    }

     private ReportDto buildAndSaveReport(User user, LocalDate startDate, LocalDate endDate, HealthAnalysisResponse analysis) {
        try {
            Report report = new Report();
            report.setUser(user);
            report.setWeekStartDate(startDate);
            report.setWeekEndDate(endDate);
            report.setGeneratedAt(LocalDateTime.now());
            report.setHealthSummary(analysis.getHealthSummary());
            report.setRiskAreas(analysis.getRiskAreas());
            report.setRecommendations(analysis.getRecommendations());

            // Save report to get ID
            Report saved = reportRepository.save(report);

            // Generate PDF safely in async
            CompletableFuture.runAsync(() -> {
                try {
                    String pdfPath = pdfService.generateReportPdf(saved);
                    saved.setPdfPath(pdfPath);
                    reportRepository.save(saved);
                } catch (Exception e) {
                    System.out.println("PDF generation failed for report {}");
                }
            }, executor);

            return new ReportDto(saved);

        } catch (Exception e) {
            System.out.println("Failed to build and save report for user {}");
            throw new RuntimeException("Report generation failed", e);
        }
    }

    @Override
    public List<ReportDto> getUserReports(Long userId) {
        return reportRepository.findByUserId(userId)
                .stream()
                .map(ReportDto::new)
                .toList();
    }

    @Override
    public Page<ReportDto> getUserReports(Long userId, Pageable pageable) {
        return reportRepository.findByUserId(userId, pageable)
                .map(ReportDto::new);
    }

    @Override
    public ReportDto getReportById(Long userId, Long reportId) {
        return reportRepository.findByIdAndUserId(reportId, userId)
                .map(ReportDto::new)
                .orElseThrow(() -> new RuntimeException("Report not found"));
    }

    @Override
    public byte[] getReportPdf(Long userId, Long reportId) {
        Report report = reportRepository.findByIdAndUserId(reportId, userId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        return pdfService.readPdfFile(report.getPdfPath());
    }

    @Override
    public void deleteReport(Long userId, Long reportId) {
        reportRepository.findByIdAndUserId(reportId, userId)
                .ifPresent(report -> {
                    pdfService.deletePdfFile(report.getPdfPath());
                    reportRepository.delete(report);
                });
    }
}
