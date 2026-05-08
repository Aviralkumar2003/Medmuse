package com.medmuse.medmuse_backend.service;

import com.itextpdf.text.DocumentException;
import com.medmuse.medmuse_backend.dto.*;
import com.medmuse.medmuse_backend.entity.Report;
import com.medmuse.medmuse_backend.entity.Symptom;
import com.medmuse.medmuse_backend.entity.User;
import com.medmuse.medmuse_backend.entity.UserDemographics;
import com.medmuse.medmuse_backend.entity.SymptomEntry;
import com.medmuse.medmuse_backend.repository.ReportRepository;
import com.medmuse.medmuse_backend.repository.SymptomEntryRepository;
import com.medmuse.medmuse_backend.repository.SymptomRepository;
import com.medmuse.medmuse_backend.repository.UserRepository;
import com.medmuse.medmuse_backend.service.ai.AIServiceInterface;
import com.medmuse.medmuse_backend.service.interfaces.ReportServiceInterface;

import jakarta.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReportService implements ReportServiceInterface {

    private final AIServiceInterface aiService;
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final SymptomEntryRepository symptomEntryRepository;
    private final SymptomRepository symptomRepository;
    private final PdfService pdfService;
    private final ModelMapper modelMapper;

    public ReportService(AIServiceInterface aiService,
            ReportRepository reportRepository,
            UserRepository userRepository,
            SymptomEntryRepository symptomEntryRepository,
            SymptomRepository symptomRepository,
            PdfService pdfService,
            ModelMapper modelMapper) {
        this.aiService = aiService;
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.symptomEntryRepository = symptomEntryRepository;
        this.symptomRepository = symptomRepository;
        this.pdfService = pdfService;
        this.modelMapper = modelMapper;
    }

    @Override
    public ReportDto generateReportForPeriod(Long userId, LocalDate startDate, LocalDate endDate) throws DocumentException, IOException {
        return generateReportForPeriod(userId, startDate, endDate, List.of());
    }

    @Override
    public ReportDto generateReportForPeriod(Long userId, LocalDate startDate, LocalDate endDate, List<Long> symptomIds)
            throws DocumentException, IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

        UserDemographics demo = user.getDemographics();
        if (demo == null) {
            throw new RuntimeException("No demographics found for user: " + userId);
        }

        List<Long> normalizedSymptomIds = normalizeSymptomIds(symptomIds);
        List<SymptomEntryDto> symptomDtos = getSymptomEntries(userId, startDate, endDate, normalizedSymptomIds);
        List<String> selectedSymptomNames = getSelectedSymptomNames(normalizedSymptomIds);

        HealthAnalysisRequest request = new HealthAnalysisRequest();
        request.setUserId(userId);
        request.setStartDate(startDate);
        request.setEndDate(endDate);
        request.setSymptomEntries(symptomDtos);
        request.setSelectedSymptomNames(selectedSymptomNames);
        request.setDemographics(modelMapper.map(demo, UserDemographicsDto.class));

        HealthAnalysisResponse response = aiService.analyzeHealthData(request);

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

        return generateReportForPeriod(id, startDate, endDate, List.of());
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

    private List<Long> normalizeSymptomIds(List<Long> symptomIds) {
        if (symptomIds == null) {
            return List.of();
        }

        return symptomIds.stream()
                .filter(Objects::nonNull)
                .distinct()
                .toList();
    }

    private List<SymptomEntryDto> getSymptomEntries(Long userId, LocalDate startDate, LocalDate endDate, List<Long> symptomIds) {
        return (symptomIds.isEmpty()
                ? symptomEntryRepository.findByUserIdAndEntryDateBetweenOrderByEntryDateDescEntryTimeDesc(userId, startDate, endDate)
                : symptomEntryRepository.findByUserIdAndEntryDateBetweenAndSymptomIdInOrderByEntryDateDescEntryTimeDesc(
                        userId,
                        startDate,
                        endDate,
                        symptomIds))
                .stream()
                .map(this::toSymptomEntryDto)
                .toList();
    }

    private List<String> getSelectedSymptomNames(List<Long> symptomIds) {
        if (symptomIds.isEmpty()) {
            return List.of();
        }

        Map<Long, String> symptomNamesById = symptomRepository.findAllById(symptomIds).stream()
                .collect(Collectors.toMap(Symptom::getId, Symptom::getName));

        return symptomIds.stream()
                .map(symptomNamesById::get)
                .filter(Objects::nonNull)
                .toList();
    }

    private SymptomEntryDto toSymptomEntryDto(SymptomEntry entry) {
        LocalDateTime loggedAt = null;
        if (entry.getEntryDate() != null && entry.getEntryTime() != null) {
            loggedAt = LocalDateTime.of(entry.getEntryDate(), entry.getEntryTime());
        }

        return new SymptomEntryDto(
                entry.getId(),
                entry.getSymptom() != null ? entry.getSymptom().getId() : null,
                entry.getSymptom() != null ? entry.getSymptom().getName() : "Custom symptom",
                entry.getSymptom() != null ? entry.getSymptom().getCategory() : "Custom",
                entry.getCustomDescription(),
                entry.getSeverity(),
                entry.getNotes(),
                entry.getEntryDate(),
                entry.getEntryTime(),
                loggedAt,
                entry.getCreatedAt());
    }
}
