package com.medmuse.medmuse_backend.service;

import com.itextpdf.text.DocumentException;
import com.medmuse.medmuse_backend.dto.*;
import com.medmuse.medmuse_backend.entity.Report;
import com.medmuse.medmuse_backend.entity.User;
import com.medmuse.medmuse_backend.entity.UserDemographics;
import com.medmuse.medmuse_backend.repository.ReportRepository;
import com.medmuse.medmuse_backend.repository.SymptomEntryRepository;
import com.medmuse.medmuse_backend.repository.UserRepository;
import com.medmuse.medmuse_backend.service.ai.AIServiceInterface;
import com.medmuse.medmuse_backend.service.interfaces.ReportServiceInterface;

import jakarta.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReportService implements ReportServiceInterface {

    @Autowired
    private ModelMapper modelMapper;

    private final AIServiceInterface aiService;
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final SymptomEntryRepository symptomEntryRepository;
    private final PdfService pdfService;

    public ReportService(AIServiceInterface aiService,
            ReportRepository reportRepository,
            UserRepository userRepository,
            SymptomEntryRepository symptomEntryRepository,
            PdfService pdfService) {
        this.aiService = aiService;
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.symptomEntryRepository = symptomEntryRepository;
        this.pdfService = pdfService;
    }

    @Override
    public ReportDto generateReportForPeriod(Long userId, LocalDate startDate, LocalDate endDate) throws DocumentException, IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

        UserDemographics demo = user.getDemographics();
        if (demo == null) {
            throw new RuntimeException("No demographics found for user: " + userId);
        }

        List<SymptomEntryDto> symptomDtos = symptomEntryRepository
                .findByUserIdAndEntryDateBetweenOrderByEntryDateDesc(userId, startDate, endDate)
                .stream()
                .map(entry -> modelMapper.map(entry, SymptomEntryDto.class))
                .toList();

        HealthAnalysisRequest request = new HealthAnalysisRequest();
        request.setUserId(userId);
        request.setStartDate(startDate);
        request.setEndDate(endDate);
        request.setSymptomEntries(symptomDtos);
        request.setDemographics(modelMapper.map(demo, UserDemographicsDto.class));

        HealthAnalysisResponse response = aiService.analyzeHealthData(request);

        System.out.println("AI Analysis Response: " + response);

        Report report = new Report();
        report.setUser(user);
        report.setWeekStartDate(startDate);
        report.setWeekEndDate(endDate);
        report.setGeneratedAt(LocalDateTime.now());
        report.setHealthSummary(response.getHealthSummary());
        report.setRiskAreas(response.getRiskAreas());
        report.setRecommendations(response.getRecommendations());
        report = reportRepository.save(report);

        String documentPath = pdfService.generatePdf(report);

        report.setPdfPath(documentPath);

        Report saved = reportRepository.save(report);
        return modelMapper.map(saved, ReportDto.class);
    }

    @Override
    public ReportDto generateWeeklyReport(Long id) throws DocumentException, IOException {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(6);

        return generateReportForPeriod(id, startDate, endDate);
    }

    @Override
    public List<ReportDto> getUserReports(Long id) {
        return reportRepository.findByUserIdOrderByGeneratedAtDesc(id)
                .stream()
                .map(entry -> modelMapper.map(entry, ReportDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public Page<ReportDto> getUserReports(Long id, Pageable pageable) {
        return reportRepository.findByUserIdOrderByGeneratedAtDesc(id, pageable)
                .map(entry -> modelMapper.map(entry, ReportDto.class));
    }

    @Override
    public ReportDto getReportById(Long id, Long reportId) {
        Report report = reportRepository.findByIdAndUserId(reportId, id)
                .orElseThrow(() -> new RuntimeException("Report not found: " + reportId));

        return modelMapper.map(report, ReportDto.class);
    }
}