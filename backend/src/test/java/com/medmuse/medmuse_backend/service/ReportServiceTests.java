package com.medmuse.medmuse_backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import com.itextpdf.text.DocumentException;
import com.medmuse.medmuse_backend.dto.HealthAnalysisRequest;
import com.medmuse.medmuse_backend.dto.HealthAnalysisResponse;
import com.medmuse.medmuse_backend.dto.ReportDto;
import com.medmuse.medmuse_backend.dto.SymptomEntryDto;
import com.medmuse.medmuse_backend.dto.UserDemographicsDto;
import com.medmuse.medmuse_backend.entity.Report;
import com.medmuse.medmuse_backend.entity.Symptom;
import com.medmuse.medmuse_backend.entity.SymptomEntry;
import com.medmuse.medmuse_backend.entity.User;
import com.medmuse.medmuse_backend.entity.UserDemographics;
import com.medmuse.medmuse_backend.repository.ReportRepository;
import com.medmuse.medmuse_backend.repository.SymptomEntryRepository;
import com.medmuse.medmuse_backend.repository.SymptomRepository;
import com.medmuse.medmuse_backend.repository.UserRepository;
import com.medmuse.medmuse_backend.service.ai.AIServiceInterface;

@ExtendWith(MockitoExtension.class)
class ReportServiceTests {

    @Mock
    private AIServiceInterface aiService;

    @Mock
    private ReportRepository reportRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SymptomEntryRepository symptomEntryRepository;

    @Mock
    private SymptomRepository symptomRepository;

    @Mock
    private PdfService pdfService;

    @Mock
    private ModelMapper modelMapper;

    private ReportService reportService;

    @BeforeEach
    void setUp() {
        reportService = new ReportService(
                aiService,
                reportRepository,
                userRepository,
                symptomEntryRepository,
                symptomRepository,
                pdfService,
                modelMapper);
    }

    @Test
    void generateReportForPeriodUsesAvailableEntriesWithinSelectedRange() throws DocumentException, IOException {
        User user = buildUser();
        UserDemographics demographics = user.getDemographics();
        Symptom headache = buildSymptom(1L, "Headache", "Pain");

        SymptomEntry firstEntry = new SymptomEntry(user, headache, null, 6, "Morning headache", LocalDate.of(2026, 5, 3), LocalTime.of(8, 15));
        SymptomEntry secondEntry = new SymptomEntry(user, headache, null, 8, "Evening headache", LocalDate.of(2026, 5, 4), LocalTime.of(19, 45));

        SymptomEntryDto firstEntryDto = buildSymptomEntryDto(
                1L,
                "Headache",
                "Pain",
                6,
                "Morning headache",
                LocalDate.of(2026, 5, 3),
                LocalTime.of(8, 15));
        SymptomEntryDto secondEntryDto = buildSymptomEntryDto(
                1L,
                "Headache",
                "Pain",
                8,
                "Evening headache",
                LocalDate.of(2026, 5, 4),
                LocalTime.of(19, 45));

        when(userRepository.findById(7L)).thenReturn(Optional.of(user));
        when(symptomEntryRepository.findByUserIdAndEntryDateBetweenOrderByEntryDateDescEntryTimeDesc(
                7L,
                LocalDate.of(2026, 4, 28),
                LocalDate.of(2026, 5, 4)))
                .thenReturn(List.of(secondEntry, firstEntry));
        when(modelMapper.map(demographics, UserDemographicsDto.class)).thenReturn(buildDemographicsDto());
        when(aiService.analyzeHealthData(any(HealthAnalysisRequest.class)))
                .thenReturn(new HealthAnalysisResponse("Summary", "Risks", "Recommendations", "OpenAI"));
        when(reportRepository.save(any(Report.class))).thenAnswer(invocation -> {
            Report report = invocation.getArgument(0);
            if (report.getId() == null) {
                report.setId(99L);
            }
            return report;
        });
        when(pdfService.generatePdf(any(Report.class))).thenReturn("C:\\reports\\report-99.pdf");
        when(modelMapper.map(any(Report.class), eq(ReportDto.class))).thenReturn(buildReportDto(99L));

        ReportDto result = reportService.generateReportForPeriod(
                7L,
                LocalDate.of(2026, 4, 28),
                LocalDate.of(2026, 5, 4));

        assertThat(result.getId()).isEqualTo(99L);

        ArgumentCaptor<HealthAnalysisRequest> requestCaptor = ArgumentCaptor.forClass(HealthAnalysisRequest.class);
        verify(aiService).analyzeHealthData(requestCaptor.capture());

        HealthAnalysisRequest capturedRequest = requestCaptor.getValue();
        assertThat(capturedRequest.getStartDate()).isEqualTo(LocalDate.of(2026, 4, 28));
        assertThat(capturedRequest.getEndDate()).isEqualTo(LocalDate.of(2026, 5, 4));
        assertThat(capturedRequest.getSelectedSymptomNames()).isEmpty();
        assertThat(capturedRequest.getSymptomEntries()).containsExactly(secondEntryDto, firstEntryDto);

        verify(symptomEntryRepository).findByUserIdAndEntryDateBetweenOrderByEntryDateDescEntryTimeDesc(
                7L,
                LocalDate.of(2026, 4, 28),
                LocalDate.of(2026, 5, 4));
        verify(symptomEntryRepository, never()).findByUserIdAndEntryDateBetweenAndSymptomIdInOrderByEntryDateDescEntryTimeDesc(
                any(),
                any(),
                any(),
                any());
    }

    @Test
    void generateReportForPeriodFiltersEntriesBySelectedSymptoms() throws DocumentException, IOException {
        User user = buildUser();
        UserDemographics demographics = user.getDemographics();
        Symptom nausea = buildSymptom(2L, "Nausea", "Digestive");
        SymptomEntry nauseaEntry = new SymptomEntry(user, nausea, null, 5, "After lunch", LocalDate.of(2026, 5, 4), LocalTime.of(13, 10));
        SymptomEntryDto nauseaEntryDto = buildSymptomEntryDto(
                2L,
                "Nausea",
                "Digestive",
                5,
                "After lunch",
                LocalDate.of(2026, 5, 4),
                LocalTime.of(13, 10));

        when(userRepository.findById(7L)).thenReturn(Optional.of(user));
        when(symptomEntryRepository.findByUserIdAndEntryDateBetweenAndSymptomIdInOrderByEntryDateDescEntryTimeDesc(
                7L,
                LocalDate.of(2026, 4, 28),
                LocalDate.of(2026, 5, 4),
                List.of(2L)))
                .thenReturn(List.of(nauseaEntry));
        when(symptomRepository.findAllById(List.of(2L))).thenReturn(List.of(nausea));
        when(modelMapper.map(demographics, UserDemographicsDto.class)).thenReturn(buildDemographicsDto());
        when(aiService.analyzeHealthData(any(HealthAnalysisRequest.class)))
                .thenReturn(new HealthAnalysisResponse("Summary", "Risks", "Recommendations", "OpenAI"));
        when(reportRepository.save(any(Report.class))).thenAnswer(invocation -> {
            Report report = invocation.getArgument(0);
            if (report.getId() == null) {
                report.setId(101L);
            }
            return report;
        });
        when(pdfService.generatePdf(any(Report.class))).thenReturn("C:\\reports\\report-101.pdf");
        when(modelMapper.map(any(Report.class), eq(ReportDto.class))).thenReturn(buildReportDto(101L));

        reportService.generateReportForPeriod(
                7L,
                LocalDate.of(2026, 4, 28),
                LocalDate.of(2026, 5, 4),
                List.of(2L));

        ArgumentCaptor<HealthAnalysisRequest> requestCaptor = ArgumentCaptor.forClass(HealthAnalysisRequest.class);
        verify(aiService).analyzeHealthData(requestCaptor.capture());

        HealthAnalysisRequest capturedRequest = requestCaptor.getValue();
        assertThat(capturedRequest.getSelectedSymptomNames()).containsExactly("Nausea");
        assertThat(capturedRequest.getSymptomEntries()).containsExactly(nauseaEntryDto);

        verify(symptomEntryRepository).findByUserIdAndEntryDateBetweenAndSymptomIdInOrderByEntryDateDescEntryTimeDesc(
                7L,
                LocalDate.of(2026, 4, 28),
                LocalDate.of(2026, 5, 4),
                List.of(2L));
        verify(symptomEntryRepository, never()).findByUserIdAndEntryDateBetweenOrderByEntryDateDescEntryTimeDesc(
                any(),
                any(),
                any());
    }

    private User buildUser() {
        User user = new User();
        user.setId(7L);
        user.setName("Aviral Kumar");

        UserDemographics demographics = new UserDemographics();
        demographics.setAge(29);
        demographics.setGender("Male");
        demographics.setWeight(72.4);
        demographics.setHeight("175 cm");
        demographics.setNationality("Indian");
        demographics.setUser(user);

        user.setDemographics(demographics);
        return user;
    }

    private Symptom buildSymptom(Long id, String name, String category) {
        Symptom symptom = new Symptom();
        symptom.setId(id);
        symptom.setName(name);
        symptom.setCategory(category);
        symptom.setActive(true);
        return symptom;
    }

    private UserDemographicsDto buildDemographicsDto() {
        UserDemographicsDto dto = new UserDemographicsDto();
        dto.setAge(29);
        dto.setGender("Male");
        dto.setWeight(72.4);
        dto.setHeight("175 cm");
        dto.setNationality("Indian");
        return dto;
    }

    private ReportDto buildReportDto(Long id) {
        ReportDto dto = new ReportDto();
        dto.setId(id);
        dto.setWeekStartDate(LocalDate.of(2026, 4, 28));
        dto.setWeekEndDate(LocalDate.of(2026, 5, 4));
        dto.setGeneratedAt(LocalDateTime.of(2026, 5, 4, 14, 0));
        dto.setHealthSummary("Summary");
        dto.setRiskAreas("Risks");
        dto.setRecommendations("Recommendations");
        dto.setPdfPath("C:\\reports\\report.pdf");
        return dto;
    }

    private SymptomEntryDto buildSymptomEntryDto(
            Long symptomId,
            String symptomName,
            String symptomCategory,
            Integer severity,
            String notes,
            LocalDate entryDate,
            LocalTime entryTime) {
        return new SymptomEntryDto(
                null,
                symptomId,
                symptomName,
                symptomCategory,
                null,
                severity,
                notes,
                entryDate,
                entryTime,
                LocalDateTime.of(entryDate, entryTime),
                null);
    }
}
