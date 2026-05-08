package com.medmuse.medmuse_backend.service.ai;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medmuse.medmuse_backend.dto.HealthAnalysisRequest;
import com.medmuse.medmuse_backend.dto.HealthAnalysisResponse;
import com.medmuse.medmuse_backend.dto.SymptomEntryDto;
import com.medmuse.medmuse_backend.dto.UserDemographicsDto;

import dev.langchain4j.model.chat.ChatModel;

@ExtendWith(MockitoExtension.class)
class LangChainAiServiceTests {

    @Mock
    private ChatModel chatModel;

    private LangChainAiService aiService;

    @BeforeEach
    void setUp() {
        aiService = new LangChainAiService(chatModel, new ObjectMapper(), "OpenAI");
    }

    @Test
    void analyzeHealthDataParsesValidJsonResponse() {
        when(chatModel.chat(anyString())).thenReturn("""
                {"healthSummary":"Stable overall","riskAreas":"Hydration","recommendations":"Drink more water"}
                """);

        HealthAnalysisResponse response = aiService.analyzeHealthData(buildRequest());

        assertThat(response.getHealthSummary()).isEqualTo("Stable overall");
        assertThat(response.getRiskAreas()).isEqualTo("Hydration");
        assertThat(response.getRecommendations()).isEqualTo("Drink more water");
        assertThat(response.getAiProvider()).isEqualTo("OpenAI");

        ArgumentCaptor<String> promptCaptor = ArgumentCaptor.forClass(String.class);
        verify(chatModel).chat(promptCaptor.capture());

        String prompt = promptCaptor.getValue();
        assertThat(prompt).contains("Report Period: 2026-05-01 to 2026-05-07");
        assertThat(prompt).contains("Applied Symptom Filters: Headache");
        assertThat(prompt).contains("- symptom=Headache; category=Pain; customDescription=none; severity=7; loggedAt=2026-05-06T09:30; notes=Sharp pain");
        assertThat(prompt).doesNotContain("SymptomEntryDto");
    }

    @Test
    void analyzeHealthDataParsesFencedJsonResponse() {
        when(chatModel.chat(anyString())).thenReturn("""
                ```json
                {"healthSummary":"Doing okay","riskAreas":"Sleep","recommendations":"Sleep earlier"}
                ```
                """);

        HealthAnalysisResponse response = aiService.analyzeHealthData(buildRequest());

        assertThat(response.getHealthSummary()).isEqualTo("Doing okay");
        assertThat(response.getRiskAreas()).isEqualTo("Sleep");
        assertThat(response.getRecommendations()).isEqualTo("Sleep earlier");
    }

    @Test
    void analyzeHealthDataFallsBackForMalformedJson() {
        when(chatModel.chat(anyString())).thenReturn("{invalid-json");

        HealthAnalysisResponse response = aiService.analyzeHealthData(buildRequest());

        assertThat(response.getHealthSummary()).isEqualTo("Unable to process AI response.");
        assertThat(response.getRiskAreas()).isEqualTo("Parsing error.");
        assertThat(response.getRecommendations()).isEqualTo("Please retry later.");
        assertThat(response.getAiProvider()).isEqualTo("OpenAI");
    }

    @Test
    void analyzeHealthDataFallsBackForBlankResponse() {
        when(chatModel.chat(anyString())).thenReturn("   ");

        HealthAnalysisResponse response = aiService.analyzeHealthData(buildRequest());

        assertThat(response.getHealthSummary()).isEqualTo("Unable to process AI response.");
        assertThat(response.getRiskAreas()).isEqualTo("Parsing error.");
        assertThat(response.getRecommendations()).isEqualTo("Please retry later.");
    }

    @Test
    void analyzeHealthDataRejectsMissingDemographics() {
        HealthAnalysisRequest request = new HealthAnalysisRequest(
                42L,
                LocalDate.of(2026, 5, 1),
                LocalDate.of(2026, 5, 7),
                List.of(buildSymptomEntryDto("Headache", "Pain", 7, "Sharp pain", LocalDate.of(2026, 5, 6), LocalTime.of(9, 30))),
                List.of("Headache"),
                null
        );

        assertThatThrownBy(() -> aiService.analyzeHealthData(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("demographics missing");

        verifyNoInteractions(chatModel);
    }

    @Test
    void analyzeHealthDataMentionsWhenFilteredSymptomsHaveNoMatchingEntries() {
        when(chatModel.chat(anyString())).thenReturn("""
                {"healthSummary":"No matching entries","riskAreas":"None","recommendations":"Continue tracking"}
                """);

        HealthAnalysisRequest request = new HealthAnalysisRequest(
                42L,
                LocalDate.of(2026, 5, 1),
                LocalDate.of(2026, 5, 7),
                List.of(),
                List.of("Nausea"),
                buildDemographics()
        );

        aiService.analyzeHealthData(request);

        ArgumentCaptor<String> promptCaptor = ArgumentCaptor.forClass(String.class);
        verify(chatModel).chat(promptCaptor.capture());

        String prompt = promptCaptor.getValue();
        assertThat(prompt).contains("Applied Symptom Filters: Nausea");
        assertThat(prompt).contains("No matching symptoms recorded for the selected filters");
    }

    @Test
    void analyzeHealthDataIncludesCustomDescriptionForCustomEntries() {
        when(chatModel.chat(anyString())).thenReturn("""
                {"healthSummary":"Logged","riskAreas":"Monitor","recommendations":"Keep tracking"}
                """);

        HealthAnalysisRequest request = new HealthAnalysisRequest(
                42L,
                LocalDate.of(2026, 5, 1),
                LocalDate.of(2026, 5, 7),
                List.of(buildCustomSymptomEntryDto(
                        "Tightness across upper chest",
                        8,
                        "Gets worse while climbing stairs",
                        LocalDate.of(2026, 5, 6),
                        LocalTime.of(18, 15))),
                List.of(),
                buildDemographics()
        );

        aiService.analyzeHealthData(request);

        ArgumentCaptor<String> promptCaptor = ArgumentCaptor.forClass(String.class);
        verify(chatModel).chat(promptCaptor.capture());

        String prompt = promptCaptor.getValue();
        assertThat(prompt).contains("- symptom=Custom symptom; category=Custom; customDescription=Tightness across upper chest; severity=8; loggedAt=2026-05-06T18:15; notes=Gets worse while climbing stairs");
    }

    private HealthAnalysisRequest buildRequest() {
        SymptomEntryDto symptomEntry = buildSymptomEntryDto(
                "Headache",
                "Pain",
                7,
                "Sharp pain",
                LocalDate.of(2026, 5, 6),
                LocalTime.of(9, 30));

        return new HealthAnalysisRequest(
                42L,
                LocalDate.of(2026, 5, 1),
                LocalDate.of(2026, 5, 7),
                List.of(symptomEntry),
                List.of("Headache"),
                buildDemographics()
        );
    }

    private UserDemographicsDto buildDemographics() {
        UserDemographicsDto demographics = new UserDemographicsDto();
        demographics.setAge(29);
        demographics.setGender("Female");
        demographics.setWeight(60.5);
        demographics.setHeight("165 cm");
        demographics.setNationality("Indian");
        return demographics;
    }

    private SymptomEntryDto buildSymptomEntryDto(
            String symptomName,
            String symptomCategory,
            Integer severity,
            String notes,
            LocalDate entryDate,
            LocalTime entryTime) {
        return new SymptomEntryDto(
                null,
                1L,
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

    private SymptomEntryDto buildCustomSymptomEntryDto(
            String customDescription,
            Integer severity,
            String notes,
            LocalDate entryDate,
            LocalTime entryTime) {
        return new SymptomEntryDto(
                null,
                null,
                "Custom symptom",
                "Custom",
                customDescription,
                severity,
                notes,
                entryDate,
                entryTime,
                LocalDateTime.of(entryDate, entryTime),
                null);
    }
}
