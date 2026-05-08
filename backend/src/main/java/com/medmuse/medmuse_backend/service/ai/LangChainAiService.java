package com.medmuse.medmuse_backend.service.ai;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medmuse.medmuse_backend.dto.HealthAnalysisRequest;
import com.medmuse.medmuse_backend.dto.HealthAnalysisResponse;
import com.medmuse.medmuse_backend.dto.SymptomEntryDto;

import dev.langchain4j.model.chat.ChatModel;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class LangChainAiService implements AIServiceInterface {

    private static final String FALLBACK_SUMMARY = "Unable to process AI response.";
    private static final String FALLBACK_RISKS = "Parsing error.";
    private static final String FALLBACK_RECOMMENDATIONS = "Please retry later.";

    private final ChatModel chatModel;
    private final ObjectMapper objectMapper;
    private final String aiProvider;

    public LangChainAiService(ChatModel chatModel,
                              ObjectMapper objectMapper,
                              @Qualifier("activeAiProviderName") String aiProvider) {
        this.chatModel = chatModel;
        this.objectMapper = objectMapper;
        this.aiProvider = aiProvider;
    }

    @Override
    public HealthAnalysisResponse analyzeHealthData(HealthAnalysisRequest request) {
        if (request == null || request.getDemographics() == null) {
            throw new RuntimeException("HealthAnalysisRequest or demographics missing");
        }

        String prompt = buildPrompt(request);
        String aiText = chatModel.chat(prompt);

        return parseResponse(aiText);
    }

    private String buildPrompt(HealthAnalysisRequest request) {
        String symptoms = formatSymptoms(request.getSymptomEntries(), request.getSelectedSymptomNames());
        String selectedSymptoms = formatSelectedSymptoms(request.getSelectedSymptomNames());
        String demographics = String.format(
                "Age: %s, Gender: %s, Weight: %s, Height: %s, Nationality: %s",
                valueOrDefault(request.getDemographics().getAge(), "unknown"),
                valueOrDefault(request.getDemographics().getGender(), "unknown"),
                valueOrDefault(request.getDemographics().getWeight(), "unknown"),
                valueOrDefault(request.getDemographics().getHeight(), "unknown"),
                valueOrDefault(request.getDemographics().getNationality(), "unknown")
        );

        return """
            You are a healthcare analytics AI assistant.

            IMPORTANT:
            - Do NOT provide medical diagnosis or treatment advice.
            - Respond ONLY with valid JSON.
            - Do NOT include code fences.
            - Do NOT include explanations.
            - Keep the response grounded in the provided report period, selected symptom filters, and symptom history only.
            - If symptom records cover only part of the selected period, summarize only the available data and do not assume unlogged days were symptom-free.
            - If symptom filters are applied, focus only on matching symptoms and explicitly note when no matching entries exist.

            Report Period: %s to %s
            Applied Symptom Filters: %s
            Person Data: %s
            Symptom Data:
            %s

            Required JSON format:

            {
              "healthSummary": "...",
              "riskAreas": "...",
              "recommendations": "..."
            }
            """.formatted(
                valueOrDefault(request.getStartDate(), "unknown"),
                valueOrDefault(request.getEndDate(), "unknown"),
                selectedSymptoms,
                demographics,
                symptoms
        );
    }

    private String formatSymptoms(List<SymptomEntryDto> symptomEntries, List<String> selectedSymptomNames) {
        if (symptomEntries == null || symptomEntries.isEmpty()) {
            return hasSelectedSymptoms(selectedSymptomNames)
                    ? "No matching symptoms recorded for the selected filters"
                    : "No symptoms recorded";
        }

        return symptomEntries.stream()
                .map(this::formatSymptomLine)
                .collect(Collectors.joining(System.lineSeparator()));
    }

    private String formatSelectedSymptoms(List<String> selectedSymptomNames) {
        if (!hasSelectedSymptoms(selectedSymptomNames)) {
            return "All symptoms";
        }

        return selectedSymptomNames.stream()
                .map(name -> valueOrDefault(name, "unknown"))
                .collect(Collectors.joining(", "));
    }

    private String formatSymptomLine(SymptomEntryDto symptomEntry) {
        if (symptomEntry == null) {
            return "- symptom=unknown; category=unknown; customDescription=none; severity=unknown; loggedAt=unknown; notes=none";
        }

        return String.format(
                "- symptom=%s; category=%s; customDescription=%s; severity=%s; loggedAt=%s; notes=%s",
                valueOrDefault(symptomEntry.getSymptomName(), "unknown"),
                valueOrDefault(symptomEntry.getSymptomCategory(), "unknown"),
                valueOrDefault(symptomEntry.getCustomDescription(), "none"),
                valueOrDefault(symptomEntry.getSeverity(), "unknown"),
                valueOrDefault(symptomEntry.getLoggedAt(), valueOrDefault(symptomEntry.getEntryDate(), "unknown")),
                valueOrDefault(symptomEntry.getNotes(), "none")
        );
    }

    private boolean hasSelectedSymptoms(List<String> selectedSymptomNames) {
        return selectedSymptomNames != null && !selectedSymptomNames.isEmpty();
    }

    private String valueOrDefault(Object value, String fallback) {
        if (value == null) {
            return fallback;
        }

        String text = value.toString().trim();
        return text.isEmpty() ? fallback : text;
    }

    private HealthAnalysisResponse parseResponse(String aiText) {
        if (aiText == null || aiText.isBlank()) {
            return fallback();
        }

        try {
            String cleanJson = sanitizeJson(aiText);
            JsonNode aiJson = objectMapper.readTree(cleanJson);

            String summary = aiJson.path("healthSummary").asText("No summary available");
            String risks = aiJson.path("riskAreas").asText("No risks detected");
            String recs = aiJson.path("recommendations").asText("No recommendations available");

            return new HealthAnalysisResponse(summary, risks, recs, aiProvider);
        } catch (JsonProcessingException e) {
            log.warn("Failed to parse {} response as JSON: {}", aiProvider, e.getOriginalMessage());
            return fallback();
        }
    }

    private String sanitizeJson(String aiText) {
        return aiText.trim()
                .replaceFirst("(?is)^```(?:json)?\\s*", "")
                .replaceFirst("(?is)\\s*```$", "")
                .trim();
    }

    private HealthAnalysisResponse fallback() {
        return new HealthAnalysisResponse(
                FALLBACK_SUMMARY,
                FALLBACK_RISKS,
                FALLBACK_RECOMMENDATIONS,
                aiProvider
        );
    }
}
